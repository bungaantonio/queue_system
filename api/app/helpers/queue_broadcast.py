# app/helpers/queue_broadcast.py

import asyncio
import logging
import time
from datetime import datetime, date, timezone
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.helpers.queue_notifier import queue_notifier
from app.schemas.queue_schema.response import QueueStateSchema
from app.schemas.time_response import UserInfo
from app.services.queue_service import consult

logger = logging.getLogger(__name__)


def serialize_dates(obj):
    """Converte datetime/date em ISO 8601 recursivamente (para JSON)."""
    if isinstance(obj, dict):
        return {k: serialize_dates(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [serialize_dates(v) for v in obj]
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    return obj


def build_queue_state(db: Session) -> dict:
    """
    Usa a camada Service para obter os dados e o Pydantic para transformar em JSON.
    """
    # Usando as suas funções de service exatamente como você postou
    current_orm = consult.get_served_user(db)
    called_orm = consult.get_called_user(db)
    waiting_list_orm = consult.list_waiting_users(db)

    timer_state = build_timer_state(db)

    # Criamos o objeto de estado a validar contra o Schema
    state = QueueStateSchema(
        current=current_orm,
        called=called_orm,
        queue=waiting_list_orm,
        timer=timer_state,
    )

    # model_dump(mode='json') converte automaticamente datetime e enums
    return state.model_dump(mode="json")


def build_timer_state(db: Session):
    user_item = consult.get_served_user(db)
    if not user_item:
        return None

    now = datetime.now(timezone.utc)

    # user_ts = Início desta fase (atendimento)
    user_ts = user_item.timestamp
    if user_ts.tzinfo is None:
        user_ts = user_ts.replace(tzinfo=timezone.utc)

    # Quanto tempo já passou desde que o status mudou para 'being_served'
    elapsed = int((now - user_ts).total_seconds())

    # Lógica de SLA para o Display:
    # Se o ‘item’ tiver um data-limite, calculamos a duração total planeada.
    # Caso o data-limite já tenha passado relativamente ao início (negativo),
    # ou não exista, definimos um padrão de 15 minutos (900s) para o gráfico.

    if user_item.sla_deadline:
        deadline_ts = user_item.sla_deadline
        if deadline_ts.tzinfo is None:
            deadline_ts = deadline_ts.replace(tzinfo=timezone.utc)

        # Orçamento total = Prazo Final - Início do Ticket
        total_budget = int((deadline_ts - user_ts).total_seconds())

        # Se o orçamento for negativo (erro de lógica de datas),
        # usamos um padrão positivo para o círculo do frontend não quebrar
        if total_budget <= 0:
            total_budget = 900  # 15 min padrão
    else:
        total_budget = 900  # 15 min padrão

    # O status é 'Ultrapassado' se o tempo atual (now) passou da data-limite
    # ou se o tempo decorrido (elapsed) passou do orçamento (total_budget)
    is_overdue = now > user_item.sla_deadline if user_item.sla_deadline else elapsed > total_budget
    status = "Ultrapassado" if is_overdue else "Dentro do limite"

    return {
        "current_user": UserInfo.from_orm_item(user_item),
        "started_at": user_ts,
        "sla_seconds": total_budget,  # O frontend usará isso como 100% do círculo
        "elapsed_seconds": elapsed,  # O frontend usará isso para preencher o círculo
        "status": status,
    }


async def broadcast_state():
    """Executa leitura pós-commit e publica estado da fila usando sessão isolada."""
    start = time.perf_counter()
    session = SessionLocal()
    try:
        state = build_queue_state(session)
        await queue_notifier.publish(state, event_name="queue_sync")
        elapsed = (time.perf_counter() - start) * 1000
        logger.info(f"Broadcast concluído com sucesso ({elapsed:.1f} ms).")
    except Exception as e:
        logger.exception(f"Erro durante broadcast_state(): {e}")
    finally:
        session.close()


def broadcast_state_sync():
    """
    Executa broadcast_state() de forma segura em BackgroundTasks.
    """
    try:
        loop = asyncio.get_running_loop()
        loop.create_task(broadcast_state())
    except RuntimeError:
        asyncio.run(broadcast_state())

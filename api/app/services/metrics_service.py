import io
import csv
import unicodedata
from collections import defaultdict
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.models.queue_item import QueueItem
from app.models.audit import Audit
from app.models.enums import AuditAction

class MetricsService:

    @staticmethod
    def _normalize_cenario_name(value: str) -> str:
        normalized = unicodedata.normalize("NFKD", (value or "").strip().lower())
        return normalized.encode("ascii", "ignore").decode("ascii")

    @staticmethod
    def _duration_seconds(start, end) -> float | None:
        if not start or not end:
            return None
        delta = (end - start).total_seconds()
        if delta < 0:
            return None
        return round(delta, 4)

    @staticmethod
    def _format_biometria_csv(value: bool | None) -> str:
        if value is True:
            return "SIM"
        if value is False:
            return "NAO"
        return "N/A"
    
    @staticmethod
    def _gather_raw_metrics(db: Session, cenario_filter: str) -> List[Dict[str, Any]]:
        """
        Lógica central: cruza QueueItem com Audit para calcular métricas.
        Retorna uma lista de dicionários.
        """
        results = []
        items = db.query(QueueItem).all()
        if not items:
            return results

        item_ids = [item.id for item in items]
        requested_cenario = (cenario_filter or "todos").strip()
        requested_cenario_normalized = MetricsService._normalize_cenario_name(requested_cenario)
        include_all = requested_cenario_normalized in {"", "*", "all", "todos"}

        tracked_actions = {
            AuditAction.QUEUE_CREATED.value,
            AuditAction.USER_ENQUEUED.value,
            AuditAction.USER_CALLED.value,
            AuditAction.QUEUE_PROCESSED.value,
        }
        audits = (
            db.query(Audit.queue_item_id, Audit.action, Audit.timestamp)
            .filter(
                Audit.queue_item_id.in_(item_ids),
                Audit.action.in_(tracked_actions),
            )
            .order_by(Audit.queue_item_id.asc(), Audit.timestamp.asc())
            .all()
        )
        audit_index = defaultdict(lambda: {"entry": None, "calls": [], "finishes": []})
        for queue_item_id, action, timestamp in audits:
            if queue_item_id is None:
                continue
            slot = audit_index[queue_item_id]
            if action in {AuditAction.QUEUE_CREATED.value, AuditAction.USER_ENQUEUED.value}:
                if slot["entry"] is None:
                    slot["entry"] = timestamp
            elif action == AuditAction.USER_CALLED.value:
                slot["calls"].append(timestamp)
            elif action == AuditAction.QUEUE_PROCESSED.value:
                slot["finishes"].append(timestamp)

        for item in items:
            scenario_label = item.scenario.name if item.scenario else "Sem_Cenario"
            scenario_code = item.scenario.code if item.scenario else "SEM_CENARIO"
            if not include_all:
                item_cenario_normalized = MetricsService._normalize_cenario_name(scenario_label)
                item_code_normalized = MetricsService._normalize_cenario_name(scenario_code)
                if (
                    item_cenario_normalized != requested_cenario_normalized
                    and item_code_normalized != requested_cenario_normalized
                ):
                    continue

            # t_entrada vem da auditoria de criação/entrada; QueueItem.timestamp pode ser sobrescrito por atualizações.
            audit_data = audit_index[item.id]
            t_entrada = audit_data["entry"] or item.timestamp
            calls = audit_data["calls"]
            finishes = audit_data["finishes"]

            t_fim = finishes[0] if finishes else None
            if t_fim and calls:
                t_chamada = next((ts for ts in reversed(calls) if ts <= t_fim), calls[0])
            else:
                t_chamada = calls[-1] if calls else None

            # 2. Lógica de Biometria
            biometria = None
            if item.credential_verified:
                biometria = True
            elif item.attempted_verification:
                biometria = False

            # 3. Cálculos de Tempo
            espera = MetricsService._duration_seconds(t_entrada, t_chamada)
            atendimento = MetricsService._duration_seconds(t_chamada, t_fim)

            results.append({
                "cenario": scenario_label,
                "id": item.id,
                "tipo": item.attendance_type,
                "t_entrada": t_entrada,
                "status": item.status,
                "biometria": biometria,
                "t_chamada": t_chamada,
                "t_fim": t_fim,
                "espera_seg": round(espera, 4) if espera is not None else None,
                "atendimento_seg": round(atendimento, 4) if atendimento is not None else None
            })
        
        return results

    @classmethod
    def get_lista_metricas(cls, db: Session, cenario_filter: str) -> List[Dict[str, Any]]:
        """Retorna os dados como lista de objetos (para o endpoint /data)"""
        return cls._gather_raw_metrics(db, cenario_filter)

    @classmethod
    def exportar_metricas_atendimento_csv(cls, db: Session, cenario_filter: str) -> str:
        """Retorna os dados como uma string formatada em CSV (para o endpoint /export-csv)"""
        data = cls._gather_raw_metrics(db, cenario_filter)
        
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Cabeçalho
        writer.writerow([
            "cenario", "id", "tipo", "t_entrada", "status", 
            "biometria", "t_chamada", "t_fim", "espera_seg", "atendimento_seg"
        ])

        for row in data:
            writer.writerow([
                row["cenario"],
                row["id"],
                row["tipo"],
                row["t_entrada"].isoformat() if row["t_entrada"] else "",
                row["status"],
                cls._format_biometria_csv(row["biometria"]),
                row["t_chamada"].isoformat() if row["t_chamada"] else "",
                row["t_fim"].isoformat() if row["t_fim"] else "",
                row["espera_seg"] if row["espera_seg"] is not None else "",
                row["atendimento_seg"] if row["atendimento_seg"] is not None else ""
            ])
            
        return output.getvalue()

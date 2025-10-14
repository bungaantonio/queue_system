from typing import Optional
from sqlalchemy.orm import Session

from app.crud import queue_crud, user_crud
from app.exceptions.exceptions import QueueException
from app.schemas.queue_schema import QueueConsultResponse


def get_user_queue_status(
    db: Session,
    id_number: Optional[str] = None,
    phone: Optional[str] = None,
) -> QueueConsultResponse:
    """
    Consulta o status atual de um usuário na fila,
    identificando-o pelo número de bilhete ou telefone.

    Retorna um objeto QueueConsultResponse indicando:
    - se o usuário está ou não na fila,
    - posição e status atuais, quando aplicável.
    """
    if not id_number and not phone:
        raise QueueException("É necessário informar o número de bilhete ou telefone.")

    user = None
    if id_number:
        user = user_crud.get_user_by_id_number(db, id_number)
    elif phone:
        user = user_crud.get_user_by_phone(db, phone)

    if not user:
        raise QueueException("user_not_found")

    queue_status = queue_crud.get_active_queue_item_by_user(db, user.id)
    if not queue_status:
        return QueueConsultResponse(in_queue=False, message="Usuário não está na fila.")

    return QueueConsultResponse(
        in_queue=True,
        position=queue_status.position,
        status=queue_status.status,
        message="Usuário está na fila.",
    )

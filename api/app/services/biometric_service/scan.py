from typing import Optional
from sqlalchemy.orm import Session

from app.helpers import biometric_helpers
from app.exceptions.exceptions import QueueException
from app.schemas.biometric_schema.response import QuickQueueEntryBiometric
from app.schemas.biometric_schema.request import BiometricScan


from app.crud.user import get_user
from app.crud.queue import enqueue_user, get_existing_queue_item


def quick_entry(
    db: Session,
    request: BiometricScan,
    biometric_id: str,
    operator_id: Optional[int] = None,
) -> QuickQueueEntryBiometric:

    user_id = biometric_helpers.identify_user(db, biometric_id)
    if not user_id:
        raise QueueException("biometric_not_recognized")

    user = get_user(db, user_id)
    if not user:
        raise QueueException("user_not_found")

    queue_item = get_existing_queue_item(db, user_id)
    if not queue_item:
        queue_item = enqueue_user(
            db,
            user=user,
            operator_id=operator_id,
            attendance_type=request.attendance_type,
        )

    # if queue_item.status == QueueStatus.CALLED_PENDING:
    #    update.mark_as_biometric_verified(db, queue_item, operator_id)
    # else:
    #    update.mark_biometric_attempt(db, queue_item, operator_id)

    return QuickQueueEntryBiometric.from_orm_item(queue_item)

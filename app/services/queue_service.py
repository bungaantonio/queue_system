from datetime import datetime, timezone
from typing import Optional, Tuple
from sqlalchemy.orm import Session
from app.helpers.audit_helpers import get_biometric_for_finished
from app.helpers.queue_helpers import map_to_queue_detail, map_to_queue_list
from app.models.queue_item import QueueItem
from app.crud import queue_crud, user_crud, biometric_crud
from app.schemas.queue_schema import (
    QueueConsult,
    QueueDetailResponse,
    QueueRegisterRequest,
)
from app.services.audit_service import AuditService
from app.exceptions.exceptions import QueueException
from app.helpers import biometric_helpers


# ------------------ REGISTER USER ------------------


# ------------------- HANDLE BIOMETRIC SCAN ------------------



# ------------------ LIST QUEUE ------------------





# ------------------ GET CALLED USER (pending verification) ------------------

from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services import biometric_service
from app.helpers.queue_broadcast import broadcast_state

router = APIRouter()

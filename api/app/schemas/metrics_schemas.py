from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AttendanceMetric(BaseModel):
    cenario: str
    id: int
    tipo: str
    t_entrada: datetime
    status: str
    biometria: Optional[bool] = None
    t_chamada: Optional[datetime] = None
    t_fim: Optional[datetime] = None
    espera_seg: Optional[float] = None
    atendimento_seg: Optional[float] = None

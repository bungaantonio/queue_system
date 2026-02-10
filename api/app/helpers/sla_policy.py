# app/helpers/sla_policy.py

from datetime import datetime, timezone
from typing import Tuple
from app.models.enums import AttendanceType


def calculate_sla(user, attendance_type: AttendanceType) -> Tuple[int, str]:
    """
    Calcula SLA (tempo máximo de espera em minutos) do usuário
    baseado em múltiplos fatores, de forma madura.

    Regras:
    1. Tipo de atendimento:
       - URGENT → menor SLA
       - PRIORITY → médio
       - NORMAL → padrão
    2. Idade ≥ 60 → reduz SLA (prioridade social)
    3. Gestante → reduz SLA
    4. Deficiência temporária → reduz SLA
    5. Pode-se adicionar ajustes contextuais futuros
    """
    base_sla = 60  # SLA padrão em minutos
    adjustments = []

    # ---- Tipo de atendimento ----
    if attendance_type == AttendanceType.URGENT:
        base_sla = 15
        adjustments.append("urgente")
    elif attendance_type == AttendanceType.PRIORITY:
        base_sla = 30
        adjustments.append("prioritário")
    elif attendance_type == AttendanceType.NORMAL:
        base_sla = 60
        adjustments.append("normal")

    # ---- Regras permanentes ----
    if user.birth_date:
        age = (datetime.now().date() - user.birth_date).days // 365
        if age >= 60:
            base_sla = min(base_sla, 20)
            adjustments.append(f"idade {age} ≥ 60")

    # ---- Regras temporárias ----
    now = datetime.now(timezone.utc)
    if user.is_pregnant and user.pregnant_until and user.pregnant_until > now:
        base_sla = min(base_sla, 15)
        adjustments.append("gestante")
    if user.is_disabled_temp and user.disabled_until and user.disabled_until > now:
        base_sla = min(base_sla, 15)
        adjustments.append("deficiência temporária")

    return base_sla, ", ".join(adjustments)

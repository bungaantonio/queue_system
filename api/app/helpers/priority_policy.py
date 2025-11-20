# app/helpers/priority_policy.py

from datetime import datetime, date, timezone

from app.models.enums import AttendanceType


def calculate_priority(user, attendance_type: str) -> tuple[int, str]:
    """
    Calcula a prioridade do cidadão com base em idade, condições temporárias e tipo de atendimento.
    Retorna (priority_score, reason_text).
    """
    score = 0
    reasons = []

    # ---- 1. Prioridade permanente: idade ----
    if user.birth_date:
        age = (date.today() - user.birth_date).days // 365
        if age >= 60:
            score += 3
            reasons.append(f"idade {age} (≥ 60)")

    # ---- 2. Prioridades temporárias ----
    now = datetime.now(timezone.utc)

    if user.is_pregnant and user.pregnant_until and user.pregnant_until > now:
        score += 2
        reasons.append("gestante")

    if user.is_disabled_temp and user.disabled_until and user.disabled_until > now:
        score += 2
        reasons.append("deficiência temporária")

    # ---- 3. Prioridade contextual (tipo de atendimento) ----
    if attendance_type == AttendanceType.PRIORITY:
        score += 3
        reasons.append("atendimento prioritário")
    elif attendance_type == AttendanceType.URGENT:
        score += 5
        reasons.append("urgente")
    elif attendance_type == AttendanceType.NORMAL:
        score += 0

    # ---- 4. Retorno consolidado ----
    reason = ", ".join(reasons) if reasons else "sem prioridade"
    return score, reason

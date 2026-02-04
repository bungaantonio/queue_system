from fastapi import Depends

from app.core.config import settings
from app.core.security import get_current_user


def resolve_operator_id(current_user=Depends(get_current_user)) -> int:
    """
    Retorna o ID do operador logado ou o ID padrão do sistema caso seja
    uma entrada rápida feita diretamente pelo usuário final.
    """
    if current_user:
        return current_user.id
    return settings.SYSTEM_OPERATOR_ID

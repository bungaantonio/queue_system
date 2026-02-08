from fastapi import Depends
from app.core.exceptions import AppException
from app.core.security import get_current_user  # Função já existente que retorna o operador logado


def require_roles(*allowed_roles: str):
    """
    Dependência FastAPI para verificar se o utilizador atual possui um dos papéis permitidos.
    Levanta AppException("auth.forbidden") se não tiver permissão.

    Uso no roteador:

    @router.post("/")
    def create_operator(
        payload: OperatorCreateRequest,
        db: Session = Depends(get_db),
        current_user=Depends(require_roles(OperatorRole.ADMIN))):
        ...
    """

    def role_checker(current_user=Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise AppException("auth.forbidden")
        return current_user

    return role_checker

from pydantic import BaseModel

# Schemas de request
class LoginSchema(BaseModel):
    username: str
    password: str


class LogoutSchema(BaseModel):
    refresh_token: str


# Schemas de response (para usar no success_response)
class LoginResponseData(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshResponseData(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LogoutResponseData(BaseModel):
    message: str

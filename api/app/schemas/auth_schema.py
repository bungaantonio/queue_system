from pydantic import BaseModel


class LoginSchema(BaseModel):
    username: str
    password: str


class LogoutSchema(BaseModel):
    refresh_token: str


class Token(BaseModel):
    access_token: str
    token_type: str

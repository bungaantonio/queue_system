from pydantic import BaseModel
from typing import Optional, Dict


class UserInfo(BaseModel):
    id: int
    short_name: str

    @classmethod
    def from_orm_item(cls, user_info):
        name_parts = user_info.user.name.split(" ")
        short_name = (
            f"{name_parts[0]} {name_parts[-1][0]}."
            if len(name_parts) > 1
            else user_info.user.name
        )

        return cls(
            id=user_info.id,
            short_name=short_name,
        )

class TimerSchema(BaseModel):
    current_user: Optional[UserInfo]
    sla_seconds: int
    elapsed_seconds: int
    status: str

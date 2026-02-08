# app/core/response.py
from typing import Any
from pydantic import BaseModel

class ApiResponse(BaseModel):
    success: bool
    data: Any | None = None
    error: dict | None = None

def success_response(data: Any) -> dict:
    return {
        "success": True,
        "data": data,
        "error": None
    }

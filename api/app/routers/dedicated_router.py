# app/routers/senha.py
from fastapi import APIRouter, HTTPException, Response

from app.core.exceptions import AppException
from app.helpers.tts import generate_senha_audio_bytes
from app.helpers.senhaSpeech import format_senha_for_speech

router = APIRouter()


@router.get("/audio/senha/{id}")
def get_senha_audio(id: int, last_digits: str):
    if not last_digits:
        raise AppException("system.missing_parameter")

    texto = format_senha_for_speech(last_digits)
    audio_buf = generate_senha_audio_bytes(texto)

    return Response(
        content=audio_buf.read(),
        media_type="audio/mpeg",
        headers={
            "Content-Disposition": f'inline; filename="senha-{id}.mp3"',
            "Content-Length": str(audio_buf.getbuffer().nbytes),
            "Accept-Ranges": "bytes",
        },
    )

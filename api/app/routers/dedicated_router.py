# app/routers/senha.py
from fastapi import APIRouter, Response

from app.core.exceptions import AppException
from app.helpers.tts import generate_ticket_audio_bytes
from app.helpers.ticketSpeech import format_ticket_for_speech

router = APIRouter()


@router.get("/audio/ticket/{id}")
def get_ticket_audio(id: int, last_digits: str):
    if not last_digits:
        raise AppException("system.missing_parameter")

    texto = format_ticket_for_speech(last_digits)
    audio_buf = generate_ticket_audio_bytes(texto)

    return Response(
        content=audio_buf.read(),
        media_type="audio/mpeg",
        headers={
            "Content-Disposition": f'inline; filename="ticket-{id}.mp3"',
            "Content-Length": str(audio_buf.getbuffer().nbytes),
            "Accept-Ranges": "bytes",
        },
    )

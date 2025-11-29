from fastapi import APIRouter, HTTPException, Response
from app.helpers.tts import generate_senha_audio_bytes

router = APIRouter()

@router.get("/audio/senha/{id}")
def get_senha_audio(id: int, last_digits: str):
    if not last_digits:
        raise HTTPException(status_code=400, detail="last_digits required")

    audio_buf = generate_senha_audio_bytes(last_digits)
    audio_buf.seek(0)
    return Response(
        content=audio_buf.read(),
        media_type="audio/mpeg",
        headers={
            "Content-Disposition": f'inline; filename="senha-{id}.mp3"',
            "Content-Length": str(audio_buf.getbuffer().nbytes),
            "Accept-Ranges": "bytes",
        },
    )

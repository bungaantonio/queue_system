# app/helpers/tts.py
from gtts import gTTS
from io import BytesIO


def generate_ticket_audio_bytes(texto: str) -> BytesIO:
    """
    Recebe texto pronto para fala (ex: 'Senha L, A, zero, um, oito')
    e retorna BytesIO com MP3.
    """
    buf = BytesIO()
    tts = gTTS(text=texto, lang="pt")
    tts.write_to_fp(buf)
    buf.seek(0)
    return buf

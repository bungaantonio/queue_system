# app/helpers/tts.py
from gtts import gTTS
from io import BytesIO

def generate_senha_audio_bytes(senha: str):
    """
    Gera MP3 soletrando a senha e retorna como BytesIO.
    """
    texto = " ".join(senha)  # soletra cada caractere
    buf = BytesIO()
    tts = gTTS(text=texto, lang="pt-PT")
    tts.write_to_fp(buf)
    buf.seek(0)
    return buf

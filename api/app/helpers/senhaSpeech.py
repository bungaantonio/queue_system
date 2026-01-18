# app/helpers/senhaSpeech.py
NUMEROS_PT = {
    "0": "zero",
    "1": "um",
    "2": "dois",
    "3": "três",
    "4": "quatro",
    "5": "cinco",
    "6": "seis",
    "7": "sete",
    "8": "oito",
    "9": "nove",
}

def format_senha_for_speech(senha: str) -> str:
    """
    Recebe string de senha e retorna texto pronto para TTS.
    Letras viram maiúsculas, números em português, separado por vírgula.
    Exemplo: L A 0 1 8 → "Senha L, A, zero, um, oito"
    """
    if not senha:
        return ""
    
    soletrado = [
        NUMEROS_PT[c] if c.isdigit() else c.upper() for c in senha
    ]
    return "Senha " + ", ".join(soletrado)

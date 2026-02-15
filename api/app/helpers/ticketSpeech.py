# app/helpers/ticketSpeech.py
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

def format_ticket_for_speech(ticket: str) -> str:
    """
    Recebe string de ticket e retorna texto pronto para TTS.
    Letras viram maiúsculas, números em português, separado por vírgula.
    Exemplo: L A 0 1 8 → "Ticket L, A, zero, um, oito"
    """
    if not ticket:
        return ""
    
    soletrado = [
        NUMEROS_PT[c] if c.isdigit() else c.upper() for c in ticket
    ]
    return "Ticket " + ", ".join(soletrado)

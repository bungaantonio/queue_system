import requests
import json
import time

# ==============================
# CONFIGURAÇÃO
# ==============================

BASE_URL = "http://127.0.0.1:8000/api/v1/queue/register"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3NzE3ODcyNjIsImV4cCI6MTc3MTc4Nzg2MiwianRpIjoiZDhmODRkN2MxNjVkNDkwYTg2ZTE1MzhkNDg4MTcwYjcifQ.bKpHHrUvGRJ0ODmjA4OKoidwddpDStZoF6mPHgyHDt8"

HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

DELAY_BETWEEN_REQUESTS = 0.2  # segundos (simula uso real)

# ==============================
# DADOS FIXOS (REPRODUZÍVEIS)
# ==============================

USERS = [
    {"name": "Isabel Fatima Pedro", "document_id": "004578932LA049", "phone": "923456789", "birth_date": "1995-04-12"},
    {"name": "Beatriz Cristina Lima", "document_id": "009834221LA012", "phone": "945678901", "birth_date": "2000-03-22"},
    {"name": "Jose da Silva", "document_id": "003211990LA003", "phone": "912345678", "birth_date": "1950-05-20"},
    {"name": "Paulo Alberto Fernandes", "document_id": "001245678LA018", "phone": "956789012", "birth_date": "1955-09-12"},
    {"name": "Carlos Alberto", "document_id": "004577932LA029", "phone": "923498765", "birth_date": "1980-01-11"},
    {"name": "Fernanda Lima", "document_id": "009834221LA013", "phone": "945670901", "birth_date": "1998-07-22"},
    {"name": "Ricardo Manuel", "document_id": "003211990LA002", "phone": "912340678", "birth_date": "1975-05-04"},
    {"name": "Leticia Gomes", "document_id": "001245678LA017", "phone": "956787012", "birth_date": "1990-03-15"},
    {"name": "Fatima dos Santos", "document_id": "004578932LA033", "phone": "923450789", "birth_date": "1993-11-08"},
    {"name": "Nelson Cruz", "document_id": "009834221LA030", "phone": "945600901", "birth_date": "1987-02-22"},
]

# Distribuição fixa de tipos
ATTENDANCE_PATTERN = [
    "urgent",
    "priority",
    "normal",
    "normal",
    "priority",
]

# ==============================
# GERAÇÃO DETERMINÍSTICA
# ==============================

def generate_test_identifier(user):
    """
    Sempre gera o mesmo identifier para o mesmo document_id.
    """
    return f"TEST-CRED-{user['document_id']}"


def get_attendance_type(index):
    """
    Distribuição previsível baseada em padrão fixo.
    """
    return ATTENDANCE_PATTERN[index % len(ATTENDANCE_PATTERN)]


# ==============================
# REGISTRO EM LOTE
# ==============================

def register_batch():
    created_identifiers = []

    for idx, user in enumerate(USERS):

        identifier = generate_test_identifier(user)
        attendance_type = get_attendance_type(idx)

        payload = {
            "user": {
                **user,
                "is_pregnant": False,
                "pregnant_until": None,
                "is_disabled_temp": False,
                "disabled_until": None,
            },
            "credential": {
                "identifier": identifier
            },
            "attendance_type": attendance_type
        }

        try:
            response = requests.post(BASE_URL, json=payload, headers=HEADERS)

            if response.status_code in (200, 201):
                print(f"[{idx+1}] OK → {user['name']} | {attendance_type} | {identifier}")
                created_identifiers.append(identifier)
            else:
                print(f"[{idx+1}] ERRO {response.status_code} → {response.text}")

        except Exception as e:
            print(f"[{idx+1}] FALHA DE CONEXÃO → {e}")

        time.sleep(DELAY_BETWEEN_REQUESTS)

    # Salva identifiers para reuso
    with open("test_credentials.json", "w") as f:
        json.dump(created_identifiers, f, indent=2)

    print("\n✅ Execução concluída.")
    print("Identifiers salvos em 'test_credentials.json'")


# ==============================
# EXECUÇÃO
# ==============================

if __name__ == "__main__":
    register_batch()

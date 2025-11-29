import requests
import uuid
import json

# URL do endpoint de registro
url = "http://127.0.0.1:8000/api/v1/queue/register"

# Lista de 20 usuários fictícios
users_data = [
    {"name": "Isabel Fatima Pedro", "document_id": "004578932LA049", "phone": "923456789", "birth_date": "1995-04-12"},
    {"name": "Beatriz Cristina Lima", "document_id": "009834221LA012", "phone": "945678901", "birth_date": "2000-03-22"},
    {"name": "Jóse da Silva", "document_id": "003211990LA003", "phone": "912345678", "birth_date": "1950-05-20"},
    {"name": "Paulo Alberto Fernandes", "document_id": "001245678LA018", "phone": "956789012", "birth_date": "1955-09-12"},
    {"name": "Carlos Alberto", "document_id": "004577932LA029", "phone": "923498765", "birth_date": "1980-01-11"},
    {"name": "Fernanda Lima", "document_id": "009834221LA013", "phone": "945670901", "birth_date": "1998-07-22"},
    {"name": "Ricardo Manuel", "document_id": "003211990LA002", "phone": "912340678", "birth_date": "1975-05-04"},
    {"name": "Leticia Gomes", "document_id": "001245678LA017", "phone": "956787012", "birth_date": "1990-03-15"},
    {"name": "Fátima dos Santos", "document_id": "004578932LA033", "phone": "923450789", "birth_date": "1993-11-08"},
    {"name": "Nelson Cruz", "document_id": "009834221LA030", "phone": "945600901", "birth_date": "1987-02-22"},
    {"name": "Paulo Martins", "document_id": "003211990LA006", "phone": "912341678", "birth_date": "1965-09-10"},
    {"name": "Sandra Costa", "document_id": "001245678LA014", "phone": "956780012", "birth_date": "1992-08-01"},
    {"name": "Helena Sousa", "document_id": "004578932LA055", "phone": "923456000", "birth_date": "1983-04-25"},
    {"name": "Mário Augusto", "document_id": "009834221LA021", "phone": "945670000", "birth_date": "1978-06-18"},
    {"name": "Roberto Silva", "document_id": "003211990LA008", "phone": "912349999", "birth_date": "1962-01-30"},
    {"name": "Patrícia Assunção", "document_id": "001245678LA020", "phone": "956789100", "birth_date": "1997-10-20"},
    {"name": "Teresa Almeida", "document_id": "004578932LA060", "phone": "923450123", "birth_date": "1994-12-14"},
    {"name": "Eduardo Gomes", "document_id": "009834221LA025", "phone": "945670555", "birth_date": "1981-07-05"},
    {"name": "Rosa Beatriz", "document_id": "003211990LA011", "phone": "912348888", "birth_date": "1958-03-27"},
    {"name": "Gabriel Manuel", "document_id": "001245678LA027", "phone": "956780888", "birth_date": "2001-09-01"}
]

# Lista para armazenar UUIDs gerados
biometric_ids = []

# Função para registrar usuários em lote
def register_users_in_batch():
    for idx, user in enumerate(users_data, start=1):
        # Gera UUID v4 para biometric_id
        biometric_uuid = str(uuid.uuid4())
        biometric_ids.append(biometric_uuid)

        payload = {
            "user": user,
            "biometric": {
                "biometric_id": biometric_uuid,
                "finger_index": (idx % 5) + 1  # Exemplo: distribui dedo de 1 a 5
            },
            "attendance_type": "urgent" if idx % 3 == 0 else "priority" if idx % 3 == 1 else "normal",
            "operator_id": 26
        }

        try:
            response = requests.post(url, json=payload)
            if response.status_code in [200, 201]:
                print(f"[{idx}] Registrado com sucesso: {user['name']} | UUID: {biometric_uuid}")
            else:
                print(f"[{idx}] Erro ao registrar {user['name']} -> {response.status_code} | {response.text}")
        except Exception as e:
            print(f"[{idx}] Falha de conexão ao registrar {user['name']} -> {e}")

    # Salva os UUIDs em um arquivo JSON
    with open("biometric_ids.json", "w") as f:
        json.dump(biometric_ids, f, indent=2)
    print(f"\n✅ Todos os UUIDs foram salvos em 'biometric_ids.json'.")

if __name__ == "__main__":
    register_users_in_batch()

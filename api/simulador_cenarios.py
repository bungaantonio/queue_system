import requests
import time
import pandas as pd
import random
from datetime import datetime

# --- CONFIGURAÇÃO ---
BASE_URL = "http://10.0.20.165:8000/api/v1"
USER, PASS = "admin", "123"

FIRST_NAMES = [
    "Mateus",
    "Ana",
    "Joao",
    "Marta",
    "Paulo",
    "Helena",
    "Afonso",
    "Carla",
    "Nelson",
    "Lidia",
    "Carlos",
    "Teresa",
    "Manuel",
    "Fatima",
    "Dario",
    "Rute",
]

LAST_NAMES = [
    "Silva",
    "Lopes",
    "Gomes",
    "Pereira",
    "Mendes",
    "Ferreira",
    "Filipe",
    "Costa",
    "Domingos",
    "Santos",
    "Quissanga",
    "Tavares",
    "Pedro",
    "Chaves",
    "Miguel",
    "Matos",
]

PROVINCE_CODES = ["LA", "BO", "UE", "CN", "CS"]


# -------------------------------------------------
# UTILITÁRIOS
# -------------------------------------------------


def gerar_nome_ficticio():
    return f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"


def gerar_document_id_valido():
    parte_inicial = f"{random.randint(0, 999_999_999):09d}"
    provincia = random.choice(PROVINCE_CODES)
    parte_final = f"{random.randint(0, 999):03d}"
    return f"{parte_inicial}{provincia}{parte_final}"


def obter_token():
    try:
        res = requests.post(
            f"{BASE_URL}/auth/login",
            json={"username": USER, "password": PASS},
        )
        return res.json().get("access_token") or res.json().get("data", {}).get(
            "access_token"
        )
    except:
        return None


# -------------------------------------------------
# SIMULAÇÃO DINÂMICA REAL
# -------------------------------------------------


def executar_cenario(
    nome_cenario, total_utentes, pesos_prioridade, min_atendimento, max_atendimento
):

    token = obter_token()
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    logs_atendimento = []

    ts = int(time.time())
    print(f"\n🎬 Iniciando {nome_cenario} ({total_utentes} utentes)...")

    utentes_criados = 0
    utentes_processados = 0

    while utentes_processados < total_utentes:

        # -------------------------------------------------
        # 1️⃣ CHEGADAS DINÂMICAS (probabilidade 60%)
        # -------------------------------------------------
        if utentes_criados < total_utentes and random.random() < 0.6:

            tipo = random.choices(
                ["normal", "priority", "urgent"], weights=pesos_prioridade
            )[0]

            doc = gerar_document_id_valido()
            cred = f"CRED-{nome_cenario}-{ts}-{utentes_criados}"

            birth_year = random.choice([1950, 1960, 1985, 1995, 2000, 2015])
            is_pregnant = random.random() < 0.1
            is_disabled = random.random() < 0.1

            payload = {
                "user": {
                    "name": gerar_nome_ficticio(),
                    "document_id": doc,
                    "phone": "900",
                    "birth_date": f"{birth_year}-01-01",
                    "is_pregnant": is_pregnant,
                    "pregnant_until": "2026-12-31" if is_pregnant else None,
                    "is_disabled_temp": is_disabled,
                    "disabled_until": "2026-12-31" if is_disabled else None,
                },
                "credential": {"identifier": cred},
                "attendance_type": tipo,
                "cenario": nome_cenario,
            }

            t_entrada = datetime.now()
            res = requests.post(
                f"{BASE_URL}/queue/register",
                json=payload,
                headers=headers,
            )

            if res.status_code in [200, 201]:
                u_id = (res.json().get("data") or res.json()).get("id")

                logs_atendimento.append(
                    {
                        "cenario": nome_cenario,
                        "id": u_id,
                        "tipo": tipo,
                        "t_entrada": t_entrada,
                        "status": "waiting",
                        "biometria": "N/A",
                    }
                )

                utentes_criados += 1

        # -------------------------------------------------
        # 2️⃣ OPERADOR TENTA CHAMAR PRÓXIMO
        # -------------------------------------------------
        res_call = requests.post(f"{BASE_URL}/queue/call-next", headers=headers)
        t_chamada = datetime.now()

        if res_call.status_code == 200:

            item = res_call.json().get("data") or res_call.json()
            curr_id = item.get("id")
            token_call = item.get("call_token")
            cred_obj = item.get("credential")
            cred_str = (
                cred_obj.get("identifier") if isinstance(cred_obj, dict) else cred_obj
            )

            sorteio = random.random()
            processado_com_sucesso = False

            # -----------------------
            # No-show (8%)
            # -----------------------
            if sorteio < 0.08:
                res_cancel = requests.post(
                    f"{BASE_URL}/queue/cancel",
                    json={"item_id": curr_id},
                    headers=headers,
                )
                if res_cancel.status_code in [200, 201]:
                    status_final = "cancelled"
                    bio_res = "N/A"
                    t_fim = datetime.now()
                    processado_com_sucesso = True
                else:
                    status_final = "cancel_failed"
                    bio_res = "N/A"
                    t_fim = datetime.now()

            # -----------------------
            # Atendimento normal
            # -----------------------
            else:
                bio_res = "success" if random.random() > 0.12 else "fail"

                auth_payload = {
                    "queue_item_id": int(curr_id),
                    "credential": str(cred_str),
                    "call_token": str(token_call),
                    "operator_id": 1,
                }

                res_auth = requests.post(
                    f"{BASE_URL}/credential/authenticate",
                    json=auth_payload,
                    headers=headers,
                )

                if res_auth.status_code in [200, 201]:
                    time.sleep(random.uniform(min_atendimento, max_atendimento))
                    res_finish = requests.post(
                        f"{BASE_URL}/queue/finish", headers=headers
                    )
                    if res_finish.status_code in [200, 201]:
                        status_final = "done"
                        t_fim = datetime.now()
                        processado_com_sucesso = True
                    else:
                        # Evita travar fila em estado ativo quando finish falha
                        res_cancel = requests.post(
                            f"{BASE_URL}/queue/cancel",
                            json={"item_id": curr_id},
                            headers=headers,
                        )
                        if res_cancel.status_code in [200, 201]:
                            status_final = "cancelled_after_finish_fail"
                            t_fim = datetime.now()
                            processado_com_sucesso = True
                        else:
                            status_final = "finish_failed"
                            t_fim = datetime.now()
                else:
                    # Evita travar fila em CALLED_PENDING quando autenticação falha
                    res_cancel = requests.post(
                        f"{BASE_URL}/queue/cancel",
                        json={"item_id": curr_id},
                        headers=headers,
                    )
                    if res_cancel.status_code in [200, 201]:
                        status_final = "cancelled_after_auth_fail"
                        bio_res = "fail"
                        t_fim = datetime.now()
                        processado_com_sucesso = True
                    else:
                        status_final = "auth_failed"
                        bio_res = "fail"
                        t_fim = datetime.now()

            # Atualizar log
            for log in logs_atendimento:
                if log["id"] == curr_id:
                    log.update(
                        {
                            "t_chamada": t_chamada,
                            "t_fim": t_fim,
                            "status": status_final,
                            "biometria": bio_res,
                        }
                    )
                    break

            if processado_com_sucesso:
                utentes_processados += 1

        time.sleep(0.5)  # Tick da simulação

    return logs_atendimento


# -------------------------------------------------
# EXECUÇÃO DOS CENÁRIOS
# -------------------------------------------------

data_a = executar_cenario("Cenario_A", 40, [0.7, 0.2, 0.1], 5, 10)
data_b = executar_cenario("Cenario_B", 30, [0.3, 0.4, 0.3], 15, 30)

# -------------------------------------------------
# PROCESSAMENTO ESTATÍSTICO
# -------------------------------------------------

df = pd.DataFrame(data_a + data_b)

df["espera_seg"] = (df["t_chamada"] - df["t_entrada"]).dt.total_seconds()
df["atendimento_seg"] = (df["t_fim"] - df["t_chamada"]).dt.total_seconds()

df.to_csv("logs_atendimento_real_tese.csv", index=False)

print("\n" + "=" * 60)
print("📊 ESTATÍSTICA DESCRITIVA POR CENÁRIO")
print("=" * 60)

for cenario in df["cenario"].unique():
    subset = df[df["cenario"] == cenario]

    print(f"\n--- {cenario} ---")
    print(f"Total Utentes: {len(subset)}")
    print("\nDistribuição Prioridade (%):")
    print((subset["tipo"].value_counts(normalize=True) * 100).round(2))

    print("\nStatus Final:")
    print(subset["status"].value_counts())

    print(f"\nMédia Espera Global: {subset['espera_seg'].mean():.2f}s")
    print(f"Mediana Espera: {subset['espera_seg'].median():.2f}s")
    print(f"Desvio Padrão Espera: {subset['espera_seg'].std():.2f}s")

    print("\nMédia Espera por Tipo:")
    print(subset.groupby("tipo")["espera_seg"].mean().round(2))

    sucesso = subset[subset["biometria"] == "success"].shape[0]
    total_bio = subset[subset["biometria"] != "N/A"].shape[0]

    print(f"\nTaxa de Sucesso Biométrico: {sucesso}/{total_bio}")

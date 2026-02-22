import requests
import time
import pandas as pd
import random
from datetime import datetime

# --- CONFIGURAÇÃO ---
BASE_URL = "http://192.168.18.6:8000/api/v1"
USER, PASS = "admin", "123"

FIRST_NAMES = [
    "Mateus", "Ana", "Joao", "Marta", "Paulo", "Helena", "Afonso", "Carla",
    "Nelson", "Lidia", "Carlos", "Teresa", "Manuel", "Fatima", "Dario", "Rute"
]

LAST_NAMES = [
    "Silva", "Lopes", "Gomes", "Pereira", "Mendes", "Ferreira", "Filipe", "Costa",
    "Domingos", "Santos", "Quissanga", "Tavares", "Pedro", "Chaves", "Miguel", "Matos"
]

PROVINCE_CODES = ["LA", "BO", "UE", "CN", "CS"]


def gerar_nome_ficticio() -> str:
    return f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"


def gerar_document_id_valido() -> str:
    parte_inicial = f"{random.randint(0, 999_999_999):09d}"
    provincia = random.choice(PROVINCE_CODES)
    parte_final = f"{random.randint(0, 999):03d}"
    return f"{parte_inicial}{provincia}{parte_final}"


def obter_token():
    try:
        res = requests.post(f"{BASE_URL}/auth/login", json={"username": USER, "password": PASS})
        return res.json().get("access_token") or res.json().get("data", {}).get("access_token")
    except: return None

def executar_cenario(nome_cenario, total_utentes, pesos_prioridade, min_atendimento, max_atendimento):
    token = obter_token()
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    logs_atendimento = []
    
    ts = int(time.time())
    print(f"\n🎬 Iniciando {nome_cenario} ({total_utentes} utentes)...")

    # 1. REGISTRO EM MASSA (Criação da carga inicial)
    for i in range(total_utentes):
        tipo = random.choices(["normal", "priority", "urgent"], weights=pesos_prioridade)[0]
        doc = gerar_document_id_valido()
        cred = f"CRED-{nome_cenario}-{ts}-{i}"
        
        payload = {
            "user": {"name": gerar_nome_ficticio(), "document_id": doc, "phone": "900", "birth_date": "1990-01-01", "is_pregnant": False, "is_disabled_temp": False},
            "credential": {"identifier": cred},
            "attendance_type": tipo,
            "cenario": nome_cenario,
        }
        
        t_entrada = datetime.now()
        res = requests.post(f"{BASE_URL}/queue/register", json=payload, headers=headers)
        
        if res.status_code in [200, 201]:
            u_id = (res.json().get("data") or res.json()).get("id")
            logs_atendimento.append({
                "cenario": nome_cenario, "id": u_id, "tipo": tipo, 
                "t_entrada": t_entrada, "status": "waiting", "biometria": "N/A"
            })
        time.sleep(0.2) # Intervalo curto de chegada

    print(f"✅ Registro concluído. Processando ciclo de vida...")

    # 2. FLUXO OPERACIONAL (Call -> Auth -> Finish/Cancel)
    for _ in range(len(logs_atendimento)):
        res_call = requests.post(f"{BASE_URL}/queue/call-next", headers=headers)
        t_chamada = datetime.now()
        
        if res_call.status_code == 200:
            item = res_call.json().get("data") or res_call.json()
            curr_id = item.get("id")
            token_call = item.get("call_token")
            cred_obj = item.get("credential")
            cred_str = cred_obj.get("identifier") if isinstance(cred_obj, dict) else cred_obj

            # Sorteio de Resultado (Realismo)
            sorteio = random.random()
            
            # Caso 1: Ausência/Cancelamento (8%)
            if sorteio < 0.08:
                requests.post(f"{BASE_URL}/queue/cancel", json={"item_id": curr_id}, headers=headers)
                status_final, bio_res, t_fim = "no_show", "N/A", datetime.now()
            
            else:
                # Caso 2: Atendimento Normal
                # Simular falha de biometria na 1ª tentativa (12% de chance)
                bio_res = "success" if random.random() > 0.12 else "fail"
                
                auth_payload = {"queue_item_id": int(curr_id), "credential": str(cred_str), "call_token": str(token_call), "operator_id": 1}
                requests.post(f"{BASE_URL}/credential/authenticate", json=auth_payload, headers=headers)
                
                # Tempo de Atendimento Variável
                time.sleep(random.uniform(min_atendimento, max_atendimento))
                
                requests.post(f"{BASE_URL}/queue/finish", headers=headers)
                status_final, t_fim = "done", datetime.now()

            # Atualizar log
            for log in logs_atendimento:
                if log["id"] == curr_id:
                    log.update({"t_chamada": t_chamada, "t_fim": t_fim, "status": status_final, "biometria": bio_res})
                    break
        elif res_call.status_code == 409:
            requests.post(f"{BASE_URL}/queue/finish", headers=headers)

    return logs_atendimento

# --- EXECUÇÃO DOS CENÁRIOS ---

# Cenário A: 40 utentes, maioria Normal, atendimento rápido
data_a = executar_cenario("Cenário_A", 40, [0.7, 0.2, 0.1], 5, 10)

# Cenário B: 30 utentes, foco em Prioritários, atendimento demorado (Stress)
data_b = executar_cenario("Cenário_B", 30, [0.3, 0.4, 0.3], 15, 30)

# --- PROCESSAMENTO E EXPORTAÇÃO ---
df = pd.DataFrame(data_a + data_b)

# Cálculos de Métricas
df['espera_seg'] = (df['t_chamada'] - df['t_entrada']).dt.total_seconds()
df['atendimento_seg'] = (df['t_fim'] - df['t_chamada']).dt.total_seconds()

# Salvar Log Mestre para Apêndice A e C
df.to_csv("logs_atendimento_real_tese.csv", index=False)

# Gerar Indicadores Agregados por Cenário
print("\n" + "="*50)
print("📊 INDICADORES AGREGADOS POR CENÁRIO")
print("="*50)

for cenario in df['cenario'].unique():
    subset = df[df['cenario'] == cenario]
    print(f"\n--- {cenario} ---")
    print(f"Total Utentes: {len(subset)}")
    print(f"Distribuição Prioridade:\n{subset['tipo'].value_counts(normalize=True)*100}")
    print(f"Status Final:\n{subset['status'].value_counts()}")
    print(f"Média Espera (Global): {subset['espera_seg'].mean():.2f}s")
    print(f"Média Espera (por tipo):\n{subset.groupby('tipo')['espera_seg'].mean()}")
    print(f"Sucesso Biométrico: {subset[subset['biometria'] == 'success'].shape[0]} de {subset[subset['biometria'] != 'N/A'].shape[0]}")

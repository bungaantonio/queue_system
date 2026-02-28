import time
from datetime import datetime
from dataclasses import dataclass
from typing import Any
import uuid

import pandas as pd
import requests
import random


# --- CONFIGURACAO ---
BASE_URL = "http://192.168.18.6:8000/api/v1"
USER, PASS = "admin", "123"
OPERATOR_ID = 1
REPEATS_PER_SCENARIO = 3 # Repetir cada cenário N vezes para gerar mais dados e permitir análise de variabilidade
BASE_SEED = 1000 # Base para geração de números aleatórios. Cada cenário e repetição terá uma seed diferente (base + número da repetição) para garantir reprodutibilidade.
TICK_SECONDS = 0.5 # A cada tick, o operador tenta chamar o próximo da fila. Se não houver progresso (nenhuma chamada, autenticação ou finalização), conta como idle. O cenário termina quando processamos todos os usuários ou atingimos um número máximo de ticks ociosos (max_idle_ticks), para evitar loops infinitos em casos de falhas.
MAX_REGISTER_RETRIES = 5
EXECUTION_TAG = datetime.now().strftime("%Y%m%d%H%M%S")
PENDING_WATCHDOG_TICKS = 8

LOGS_FILE = "logs_atendimento_real_tese.csv"
KPI_SCENARIO_FILE = "kpi_por_cenario.csv"
KPI_PRIORITY_FILE = "kpi_por_prioridade.csv"
KPI_PRIORITY_SCORE_FILE = "kpi_por_pontuacao_prioridade.csv"
CHECKS_FILE = "validacao_hipoteses.csv"
RESET_QUEUE_STATE_BEFORE_RUN = True
MAX_RESET_LOOPS = 200


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


@dataclass
class ScenarioConfig:
    name: str
    total_users: int
    priority_weights: list[float]
    min_service: float
    max_service: float
    arrival_probability: float
    no_show_probability: float
    initial_backlog: int


SCENARIOS = [
    ScenarioConfig(
        name="Cenario_A",
        total_users=30,
        priority_weights=[0.7, 0.2, 0.1],
        min_service=1,
        max_service=2,
        arrival_probability=0.60,
        no_show_probability=0.08,
        initial_backlog=10,
    ),
    ScenarioConfig(
        name="Cenario_B",
        total_users=40,
        priority_weights=[0.3, 0.4, 0.3],
        min_service=2,
        max_service=4,
        arrival_probability=0.70,
        no_show_probability=0.10,
        initial_backlog=14,
    ),
    ScenarioConfig(
        name="Cenario_C",
        total_users=60,
        priority_weights=[0.2, 0.4, 0.4],
        min_service=3,
        max_service=5,
        arrival_probability=0.80,
        no_show_probability=0.12,
        initial_backlog=20,
    ),
]


def gerar_nome_ficticio(rng: random.Random) -> str:
    return f"{rng.choice(FIRST_NAMES)} {rng.choice(LAST_NAMES)}"


def gerar_document_id_valido(rng: random.Random) -> str:
    parte_inicial = f"{rng.randint(0, 999_999_999):09d}"
    provincia = rng.choice(PROVINCE_CODES)
    parte_final = f"{rng.randint(0, 999):03d}"
    return f"{parte_inicial}{provincia}{parte_final}"


def obter_token() -> str | None:
    try:
        res = requests.post(
            f"{BASE_URL}/auth/login",
            json={"username": USER, "password": PASS},
            timeout=15,
        )
        body = res.json()
        return body.get("access_token") or body.get("data", {}).get("access_token")
    except Exception:
        return None


def build_headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


def request_with_reauth(
    method: str,
    url: str,
    headers: dict[str, str],
    json_payload: dict[str, Any] | None = None,
    timeout: int = 15,
) -> requests.Response | None:
    try:
        res = requests.request(method, url, headers=headers, json=json_payload, timeout=timeout)
    except Exception:
        return None

    if res.status_code != 401:
        return res

    new_token = obter_token()
    if not new_token:
        return res

    headers.update(build_headers(new_token))
    try:
        return requests.request(method, url, headers=headers, json=json_payload, timeout=timeout)
    except Exception:
        return None


def now_str() -> str:
    return datetime.now().isoformat(sep=" ", timespec="microseconds")


def get_error_code(res: requests.Response | None) -> str | None:
    if res is None:
        return None
    try:
        body = res.json()
    except Exception:
        return None
    detail = body.get("detail") if isinstance(body, dict) else None
    if isinstance(detail, dict):
        return detail.get("code")
    return None


def parse_dt(value: Any) -> Any:
    if not value:
        return pd.NaT
    return pd.to_datetime(value, errors="coerce")


def reset_queue_state(headers: dict[str, str]) -> None:
    """
    Limpa estado ativo da fila antes de cada run (waiting/called/being_served),
    para garantir experimentos reprodutíveis sem contaminação de execuções anteriores.
    """
    for _ in range(MAX_RESET_LOOPS):
        state_resp = request_with_reauth(
            "GET",
            f"{BASE_URL}/queue/waiting-and-called",
            headers=headers,
        )
        if state_resp is None or state_resp.status_code != 200:
            break

        body = state_resp.json()
        data = body.get("data") if isinstance(body, dict) else {}
        if not isinstance(data, dict):
            break

        cancel_ids: set[int] = set()

        current = data.get("current")
        called = data.get("called")
        queue = data.get("queue") or []

        if isinstance(current, dict) and current.get("id") is not None:
            cancel_ids.add(int(current["id"]))
        if isinstance(called, dict) and called.get("id") is not None:
            cancel_ids.add(int(called["id"]))
        if isinstance(queue, list):
            for item in queue:
                if isinstance(item, dict) and item.get("id") is not None:
                    cancel_ids.add(int(item["id"]))

        if not cancel_ids:
            break

        for item_id in cancel_ids:
            request_with_reauth(
                "POST",
                f"{BASE_URL}/queue/cancel",
                headers=headers,
                json_payload={"item_id": item_id},
            )


def calcular_priority_score_esperado(birth_year: int, is_pregnant: bool, is_disabled: bool, tipo: str) -> int:
    score = 0

    # Regra de idade (>= 60) igual a priority_policy
    current_year = datetime.now().year
    age = current_year - birth_year
    if age >= 60:
        score += 3

    # Regras temporarias
    if is_pregnant:
        score += 2
    if is_disabled:
        score += 2

    # Tipo de atendimento
    if tipo == "priority":
        score += 3
    elif tipo == "urgent":
        score += 5

    return score


def executar_cenario(cfg: ScenarioConfig, run_id: str, seed: int, headers: dict[str, str]) -> list[dict[str, Any]]:
    rng = random.Random(seed)
    logs: list[dict[str, Any]] = []
    by_item_id: dict[int, dict[str, Any]] = {}

    created = 0
    processed = 0
    idle_ticks = 0
    max_idle_ticks = 1200
    pending_watch_item_id: int | None = None
    pending_watch_ticks = 0

    print(f"\nIniciando {cfg.name} | run_id={run_id} | seed={seed} | total={cfg.total_users}")

    while processed < cfg.total_users and idle_ticks < max_idle_ticks:
        houve_progresso = False

        # 1) Chegadas dinamicas
        if (
            created < cfg.total_users
            and rng.random() < cfg.arrival_probability
            and pending_watch_ticks == 0
        ):
            tipo = rng.choices(["normal", "priority", "urgent"], weights=cfg.priority_weights)[0]
            birth_year = rng.choice([1950, 1960, 1985, 1995, 2000, 2015])
            is_pregnant = rng.random() < 0.1
            is_disabled = rng.random() < 0.1
            priority_score_expected = calcular_priority_score_esperado(
                birth_year=birth_year,
                is_pregnant=is_pregnant,
                is_disabled=is_disabled,
                tipo=tipo,
            )
            t_entrada = now_str()

            for _attempt in range(1, MAX_REGISTER_RETRIES + 1):
                # Evita colisao entre execucoes diferentes (credenciais repetidas)
                cred = f"CRED-{EXECUTION_TAG}-{cfg.name}-{run_id}-{created}-{uuid.uuid4().hex[:8]}"
                payload = {
                    "user": {
                        "name": gerar_nome_ficticio(rng),
                        "document_id": gerar_document_id_valido(rng),
                        "phone": "900",
                        "birth_date": f"{birth_year}-01-01",
                        "is_pregnant": is_pregnant,
                        "pregnant_until": "2026-12-31" if is_pregnant else None,
                        "is_disabled_temp": is_disabled,
                        "disabled_until": "2026-12-31" if is_disabled else None,
                    },
                    "credential": {"identifier": cred},
                    "attendance_type": tipo,
                    "cenario": cfg.name,
                }

                try:
                    res = request_with_reauth(
                        "POST",
                        f"{BASE_URL}/queue/register",
                        headers=headers,
                        json_payload=payload,
                    )
                    register_http = res.status_code if res is not None else -1
                except Exception:
                    res = None
                    register_http = -1

                if res is not None and register_http in [200, 201]:
                    body = res.json().get("data") or res.json()
                    queue_item_id = body.get("id")
                    if queue_item_id is not None:
                        record = {
                            "scenario": cfg.name,
                            "run_id": run_id,
                            "seed": seed,
                            "operator_id": OPERATOR_ID,
                            "queue_item_id": int(queue_item_id),
                            "tipo": tipo,
                            "priority_score_expected": priority_score_expected,
                            "register_http": register_http,
                            "call_http": None,
                            "auth_http": None,
                            "finish_http": None,
                            "cancel_http": None,
                            "auth_ok": 0,
                            "finish_ok": 0,
                            "status_final": "waiting",
                            "motivo_final": "waiting",
                            "biometria": "N/A",
                            "t_entrada": t_entrada,
                            "t_chamada": None,
                            "t_auth": None,
                            "t_fim": None,
                        }
                        by_item_id[int(queue_item_id)] = record
                        logs.append(record)
                        created += 1
                        houve_progresso = True
                    break

                # 409 = conflito de utilizador/credencial, tenta novamente neste tick
                if register_http == 409:
                    continue

                # Outros erros: nao insiste infinitamente
                break

        # 2) Operador chama proximo apenas se houver utentes criados ainda nao processados
        # e so depois de formar backlog inicial para observar fairness sob fila real.
        can_call = created > processed and (created >= cfg.initial_backlog or created >= cfg.total_users)
        pending_code = None
        if can_call:
            try:
                res_call = request_with_reauth(
                    "POST",
                    f"{BASE_URL}/queue/call-next",
                    headers=headers,
                )
                call_http = res_call.status_code if res_call is not None else -1
                pending_code = get_error_code(res_call)
            except Exception:
                res_call = None
                call_http = -1
        else:
            res_call = None
            call_http = None

        # Se ja existe item pendente de verificacao, tenta recupera-lo e finalizar fluxo
        item = None
        allow_no_show = True
        if res_call is not None and call_http == 200:
            item = res_call.json().get("data") or res_call.json()
            pending_watch_item_id = None
            pending_watch_ticks = 0
        elif res_call is not None and call_http == 409 and pending_code == "queue.pending_verification_exists":
            pending_resp = request_with_reauth(
                "GET",
                f"{BASE_URL}/queue/next-called-for-client",
                headers=headers,
            )
            if pending_resp is not None and pending_resp.status_code == 200:
                item = pending_resp.json().get("data") or pending_resp.json()
                allow_no_show = False
                curr_pending_id = item.get("id")
                if curr_pending_id is not None:
                    curr_pending_id = int(curr_pending_id)
                    if pending_watch_item_id == curr_pending_id:
                        pending_watch_ticks += 1
                    else:
                        pending_watch_item_id = curr_pending_id
                        pending_watch_ticks = 1
            else:
                pending_watch_ticks += 1

        if item is not None:
            curr_id = item.get("id")
            if curr_id is None:
                time.sleep(TICK_SECONDS)
                idle_ticks += 1
                continue

            curr_id = int(curr_id)
            token_call = item.get("call_token")
            cred_obj = item.get("credential")
            cred_str = cred_obj.get("identifier") if isinstance(cred_obj, dict) else cred_obj

            if curr_id not in by_item_id:
                by_item_id[curr_id] = {
                    "scenario": cfg.name,
                    "run_id": run_id,
                    "seed": seed,
                    "operator_id": OPERATOR_ID,
                    "queue_item_id": curr_id,
                    "tipo": "unknown",
                    "priority_score_expected": -1,
                    "register_http": None,
                    "call_http": None,
                    "auth_http": None,
                    "finish_http": None,
                    "cancel_http": None,
                    "auth_ok": 0,
                    "finish_ok": 0,
                    "status_final": "unknown",
                    "motivo_final": "missing_register_log",
                    "biometria": "N/A",
                    "t_entrada": None,
                    "t_chamada": None,
                    "t_auth": None,
                    "t_fim": None,
                }
                logs.append(by_item_id[curr_id])

            rec = by_item_id[curr_id]
            rec["call_http"] = call_http if call_http is not None else rec.get("call_http")
            rec["t_chamada"] = now_str()

            # No-show
            if allow_no_show and rng.random() < cfg.no_show_probability:
                try:
                    res_cancel = request_with_reauth(
                        "POST",
                        f"{BASE_URL}/queue/cancel",
                        headers=headers,
                        json_payload={"item_id": curr_id},
                    )
                    rec["cancel_http"] = res_cancel.status_code if res_cancel is not None else -1
                except Exception:
                    rec["cancel_http"] = -1

                if rec["cancel_http"] in [200, 201]:
                    rec["status_final"] = "cancelled"
                    rec["motivo_final"] = "no_show"
                else:
                    rec["status_final"] = "cancel_failed"
                    rec["motivo_final"] = "no_show_cancel_failed"

                rec["biometria"] = "N/A"
                rec["t_fim"] = now_str()
                processed += 1
                houve_progresso = True
                pending_watch_item_id = None
                pending_watch_ticks = 0
            else:
                auth_payload = {
                    "queue_item_id": curr_id,
                    "credential": str(cred_str),
                    "call_token": str(token_call),
                    "operator_id": OPERATOR_ID,
                }

                try:
                    res_auth = request_with_reauth(
                        "POST",
                        f"{BASE_URL}/credential/authenticate",
                        headers=headers,
                        json_payload=auth_payload,
                    )
                    rec["auth_http"] = res_auth.status_code if res_auth is not None else -1
                except Exception:
                    rec["auth_http"] = -1

                rec["t_auth"] = now_str()
                rec["auth_ok"] = 1 if rec["auth_http"] in [200, 201] else 0
                rec["biometria"] = "success" if rec["auth_ok"] == 1 else "fail"

                if rec["auth_ok"] == 1:
                    time.sleep(rng.uniform(cfg.min_service, cfg.max_service))
                    try:
                        res_finish = request_with_reauth(
                            "POST",
                            f"{BASE_URL}/queue/finish",
                            headers=headers,
                        )
                        rec["finish_http"] = res_finish.status_code if res_finish is not None else -1
                    except Exception:
                        rec["finish_http"] = -1

                    rec["finish_ok"] = 1 if rec["finish_http"] in [200, 201] else 0
                    if rec["finish_ok"] == 1:
                        rec["status_final"] = "done"
                        rec["motivo_final"] = "auth_and_finish_ok"
                        rec["t_fim"] = now_str()
                        processed += 1
                        houve_progresso = True
                        pending_watch_item_id = None
                        pending_watch_ticks = 0
                    else:
                        try:
                            res_cancel = request_with_reauth(
                                "POST",
                                f"{BASE_URL}/queue/cancel",
                                headers=headers,
                                json_payload={"item_id": curr_id},
                            )
                            rec["cancel_http"] = res_cancel.status_code if res_cancel is not None else -1
                        except Exception:
                            rec["cancel_http"] = -1

                        rec["t_fim"] = now_str()
                        if rec["cancel_http"] in [200, 201]:
                            rec["status_final"] = "cancelled_after_finish_fail"
                            rec["motivo_final"] = "finish_failed_but_cancelled"
                        else:
                            rec["status_final"] = "finish_failed"
                            rec["motivo_final"] = "finish_and_cancel_failed"
                        processed += 1
                        houve_progresso = True
                        pending_watch_item_id = None
                        pending_watch_ticks = 0
                else:
                    try:
                        res_cancel = request_with_reauth(
                            "POST",
                            f"{BASE_URL}/queue/cancel",
                            headers=headers,
                            json_payload={"item_id": curr_id},
                        )
                        rec["cancel_http"] = res_cancel.status_code if res_cancel is not None else -1
                    except Exception:
                        rec["cancel_http"] = -1

                    rec["t_fim"] = now_str()
                    if rec["cancel_http"] in [200, 201]:
                        rec["status_final"] = "cancelled_after_auth_fail"
                        rec["motivo_final"] = "auth_failed_but_cancelled"
                    else:
                        rec["status_final"] = "auth_failed"
                        rec["motivo_final"] = "auth_and_cancel_failed"
                    processed += 1
                    houve_progresso = True
                    pending_watch_item_id = None
                    pending_watch_ticks = 0

        # Watchdog: se o mesmo pendente persistir, força cancelamento para destravar a fila
        if pending_watch_item_id is not None and pending_watch_ticks >= PENDING_WATCHDOG_TICKS:
            watchdog_rec = by_item_id.get(pending_watch_item_id)
            if watchdog_rec is not None:
                try:
                    res_cancel = request_with_reauth(
                        "POST",
                        f"{BASE_URL}/queue/cancel",
                        headers=headers,
                        json_payload={"item_id": pending_watch_item_id},
                    )
                    watchdog_rec["cancel_http"] = res_cancel.status_code if res_cancel is not None else -1
                except Exception:
                    watchdog_rec["cancel_http"] = -1
                watchdog_rec["status_final"] = "cancelled_by_watchdog"
                watchdog_rec["motivo_final"] = "pending_verification_watchdog"
                watchdog_rec["t_fim"] = now_str()
                processed += 1
                houve_progresso = True
            pending_watch_item_id = None
            pending_watch_ticks = 0

        if houve_progresso:
            idle_ticks = 0
        else:
            idle_ticks += 1

        time.sleep(TICK_SECONDS)

    if idle_ticks >= max_idle_ticks:
        print(f"[WARN] Encerrado por max_idle_ticks: {cfg.name} | run_id={run_id}")

    return logs


def adicionar_metricas(df: pd.DataFrame) -> pd.DataFrame:
    df["t_entrada"] = df["t_entrada"].apply(parse_dt)
    df["t_chamada"] = df["t_chamada"].apply(parse_dt)
    df["t_auth"] = df["t_auth"].apply(parse_dt)
    df["t_fim"] = df["t_fim"].apply(parse_dt)

    df["espera_seg"] = (df["t_chamada"] - df["t_entrada"]).dt.total_seconds()
    df["atendimento_seg"] = (df["t_fim"] - df["t_chamada"]).dt.total_seconds()
    df["espera_min"] = df["espera_seg"] / 60.0
    df["atendimento_min"] = df["atendimento_seg"] / 60.0
    return df


def arredondar_colunas_minutos(df: pd.DataFrame, casas: int = 2) -> pd.DataFrame:
    out = df.copy()
    minute_cols = [c for c in out.columns if c.endswith("_min")]
    if minute_cols:
        out[minute_cols] = out[minute_cols].round(casas)
    return out


def ordenar_colunas_tempo(df: pd.DataFrame) -> pd.DataFrame:
    """
    Reordena colunas para deixar pares *_seg e *_min lado a lado.
    """
    cols = list(df.columns)
    ordered: list[str] = []
    used: set[str] = set()

    for col in cols:
        if col in used:
            continue

        if col.endswith("_seg"):
            base = col[:-4]
            min_col = f"{base}_min"
            ordered.append(col)
            used.add(col)
            if min_col in cols and min_col not in used:
                ordered.append(min_col)
                used.add(min_col)
            continue

        if col.endswith("_min"):
            seg_col = f"{col[:-4]}_seg"
            if seg_col in cols:
                continue

        ordered.append(col)
        used.add(col)

    for col in cols:
        if col not in used:
            ordered.append(col)

    return df[ordered]


def validar_invariantes(df: pd.DataFrame) -> pd.DataFrame:
    checks: list[dict[str, Any]] = []

    done_invalid = int(
        ((df["status_final"] == "done") & ((df["auth_ok"] != 1) | (df["finish_ok"] != 1))).sum()
    )
    checks.append(
        {
            "check": "H1_done_requer_auth_e_finish",
            "violacoes": done_invalid,
            "resultado": "OK" if done_invalid == 0 else "FALHA",
        }
    )

    required_trace = [
        "scenario",
        "run_id",
        "seed",
        "queue_item_id",
        "tipo",
        "status_final",
        "t_entrada",
        "t_chamada",
        "t_fim",
    ]
    missing_trace = int(df[required_trace].isna().any(axis=1).sum())
    checks.append(
        {
            "check": "H2_trilha_completa",
            "violacoes": missing_trace,
            "resultado": "OK" if missing_trace == 0 else "FALHA",
        }
    )

    h3_rows = []
    for scenario_name, subset in df[df["status_final"] == "done"].groupby("scenario"):
        valid = subset[
            subset["priority_score_expected"].notna()
            & subset["espera_seg"].notna()
            & (subset["priority_score_expected"] >= 0)
        ]
        if len(valid) < 5:
            resultado = "NA"
            violacoes = 1
        else:
            # Spearman sem scipy: correlacao de Pearson sobre os ranks
            rank_score = valid["priority_score_expected"].rank(method="average")
            rank_wait = valid["espera_seg"].rank(method="average")
            corr = rank_score.corr(rank_wait, method="pearson")
            corr = 0.0 if pd.isna(corr) else float(corr)
            ok = corr < 0
            resultado = "OK" if ok else "FALHA"
            violacoes = 0 if ok else 1
        h3_rows.append(
            {
                "check": f"H3_fairness_score_{scenario_name}",
                "violacoes": violacoes,
                "resultado": resultado,
            }
        )
    checks.extend(h3_rows)

    out = pd.DataFrame(checks)
    out_pt = traduzir_output_pt_pt(out, contexto="checks")
    out_pt.to_csv(CHECKS_FILE, index=False)
    return out_pt


def gerar_kpis(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
    by_scenario = (
        df.groupby(["scenario"])
        .agg(
            total=("queue_item_id", "count"),
            done=("status_final", lambda s: (s == "done").sum()),
            cancelled=("status_final", lambda s: s.astype(str).str.startswith("cancel").sum()),
            auth_success_rate=("auth_ok", "mean"),
            finish_success_rate=("finish_ok", "mean"),
            espera_media_seg=("espera_seg", "mean"),
            espera_mediana_seg=("espera_seg", "median"),
            espera_p95_seg=("espera_seg", lambda x: x.quantile(0.95)),
            atendimento_media_seg=("atendimento_seg", "mean"),
            atendimento_p95_seg=("atendimento_seg", lambda x: x.quantile(0.95)),
            espera_media_min=("espera_min", "mean"),
            espera_mediana_min=("espera_min", "median"),
            espera_p95_min=("espera_min", lambda x: x.quantile(0.95)),
            atendimento_media_min=("atendimento_min", "mean"),
            atendimento_p95_min=("atendimento_min", lambda x: x.quantile(0.95)),
        )
        .reset_index()
    )

    by_priority = (
        df.groupby(["scenario", "tipo"])
        .agg(
            total=("queue_item_id", "count"),
            espera_media_seg=("espera_seg", "mean"),
            espera_mediana_seg=("espera_seg", "median"),
            espera_p95_seg=("espera_seg", lambda x: x.quantile(0.95)),
            atendimento_media_seg=("atendimento_seg", "mean"),
            atendimento_p95_seg=("atendimento_seg", lambda x: x.quantile(0.95)),
            espera_media_min=("espera_min", "mean"),
            espera_mediana_min=("espera_min", "median"),
            espera_p95_min=("espera_min", lambda x: x.quantile(0.95)),
            atendimento_media_min=("atendimento_min", "mean"),
            atendimento_p95_min=("atendimento_min", lambda x: x.quantile(0.95)),
        )
        .reset_index()
    )

    # Faixas para discussão de fairness baseada em score efetivo
    df_scored = df.copy()
    df_scored["priority_band"] = pd.cut(
        df_scored["priority_score_expected"],
        bins=[-1, 2, 4, 99],
        labels=["baixa_0_2", "media_3_4", "alta_5_plus"],
    )
    by_score_band = (
        df_scored.groupby(["scenario", "priority_band"])
        .agg(
            total=("queue_item_id", "count"),
            espera_media_seg=("espera_seg", "mean"),
            espera_mediana_seg=("espera_seg", "median"),
            espera_p95_seg=("espera_seg", lambda x: x.quantile(0.95)),
            espera_media_min=("espera_min", "mean"),
            espera_mediana_min=("espera_min", "median"),
            espera_p95_min=("espera_min", lambda x: x.quantile(0.95)),
        )
        .reset_index()
    )

    by_scenario_csv = ordenar_colunas_tempo(arredondar_colunas_minutos(by_scenario, casas=2))
    by_priority_csv = ordenar_colunas_tempo(arredondar_colunas_minutos(by_priority, casas=2))
    by_score_band_csv = ordenar_colunas_tempo(arredondar_colunas_minutos(by_score_band, casas=2))

    by_scenario_pt = traduzir_output_pt_pt(by_scenario_csv, contexto="kpi")
    by_priority_pt = traduzir_output_pt_pt(by_priority_csv, contexto="kpi")
    by_score_band_pt = traduzir_output_pt_pt(by_score_band_csv, contexto="kpi")

    by_scenario_pt.to_csv(KPI_SCENARIO_FILE, index=False)
    by_priority_pt.to_csv(KPI_PRIORITY_FILE, index=False)
    by_score_band_pt.to_csv(KPI_PRIORITY_SCORE_FILE, index=False)
    return by_scenario_pt, by_priority_pt


def traduzir_output_pt_pt(df: pd.DataFrame, contexto: str) -> pd.DataFrame:
    out = df.copy()

    if "tipo" in out.columns:
        out["tipo"] = out["tipo"].replace(
            {
                "normal": "normal",
                "priority": "prioritario",
                "urgent": "urgente",
            }
        )

    if "status_final" in out.columns:
        out["status_final"] = out["status_final"].replace(
            {
                "waiting": "em_espera",
                "done": "concluido",
                "cancelled": "cancelado",
                "cancel_failed": "falha_cancelamento",
                "cancelled_after_finish_fail": "cancelado_apos_falha_finalizacao",
                "finish_failed": "falha_finalizacao",
                "cancelled_after_auth_fail": "cancelado_apos_falha_autenticacao",
                "auth_failed": "falha_autenticacao",
                "cancelled_by_watchdog": "cancelado_por_watchdog",
                "unknown": "desconhecido",
            }
        )

    if "motivo_final" in out.columns:
        out["motivo_final"] = out["motivo_final"].replace(
            {
                "waiting": "em_espera",
                "no_show": "faltou",
                "no_show_cancel_failed": "faltou_e_falhou_cancelamento",
                "auth_and_finish_ok": "autenticacao_e_finalizacao_ok",
                "finish_failed_but_cancelled": "falhou_finalizacao_mas_foi_cancelado",
                "finish_and_cancel_failed": "falhou_finalizacao_e_cancelamento",
                "auth_failed_but_cancelled": "falhou_autenticacao_mas_foi_cancelado",
                "auth_and_cancel_failed": "falhou_autenticacao_e_cancelamento",
                "pending_verification_watchdog": "watchdog_verificacao_pendente",
                "missing_register_log": "sem_registo_de_entrada",
            }
        )

    if contexto == "checks":
        out = out.rename(
            columns={
                "check": "verificacao",
            }
        )

    if contexto == "kpi":
        out = out.rename(
            columns={
                "scenario": "cenario",
                "tipo": "tipo_atendimento",
                "priority_band": "faixa_prioridade",
                "done": "concluidos",
                "cancelled": "cancelados",
                "auth_success_rate": "taxa_sucesso_autenticacao",
                "finish_success_rate": "taxa_sucesso_finalizacao",
            }
        )

    if contexto == "logs":
        out = out.rename(
            columns={
                "scenario": "cenario",
                "run_id": "id_execucao",
                "seed": "semente",
                "queue_item_id": "id_item_fila",
                "tipo": "tipo_atendimento",
                "priority_score_expected": "pontuacao_prioridade_esperada",
                "register_http": "http_registo",
                "call_http": "http_chamada",
                "auth_http": "http_autenticacao",
                "finish_http": "http_finalizacao",
                "cancel_http": "http_cancelamento",
                "auth_ok": "autenticacao_ok",
                "finish_ok": "finalizacao_ok",
                "status_final": "estado_final",
                "t_entrada": "instante_entrada",
                "t_chamada": "instante_chamada",
                "t_auth": "instante_autenticacao",
                "t_fim": "instante_fim",
            }
        )

    return out


def main() -> None:
    token = obter_token()
    if not token:
        raise RuntimeError("Nao foi possivel obter token de autenticacao.")

    headers = build_headers(token)
    all_logs: list[dict[str, Any]] = []

    for cfg in SCENARIOS:
        for run_number in range(1, REPEATS_PER_SCENARIO + 1):
            seed = BASE_SEED + run_number
            run_id = f"{cfg.name}_run_{run_number:02d}"
            if RESET_QUEUE_STATE_BEFORE_RUN:
                reset_queue_state(headers)
            all_logs.extend(executar_cenario(cfg, run_id, seed, headers))

    df = pd.DataFrame(all_logs)
    df = adicionar_metricas(df)
    df_csv = ordenar_colunas_tempo(arredondar_colunas_minutos(df, casas=2))
    df_csv = traduzir_output_pt_pt(df_csv, contexto="logs")
    df_csv.to_csv(LOGS_FILE, index=False)

    checks = validar_invariantes(df)
    kpi_scenario, kpi_priority = gerar_kpis(df)

    print("\n" + "=" * 70)
    print("VALIDACAO DAS HIPOTESES (H1/H2/H3)")
    print("=" * 70)
    print(checks.to_string(index=False))

    print("\n" + "=" * 70)
    print("KPIs POR CENARIO")
    print("=" * 70)
    print(kpi_scenario.to_string(index=False))

    print("\n" + "=" * 70)
    print("KPIs POR PRIORIDADE (TOP 15)")
    print("=" * 70)
    print(kpi_priority.head(15).to_string(index=False))

    print("\nFicheiros gerados:")
    print(f"- {LOGS_FILE}")
    print(f"- {CHECKS_FILE}")
    print(f"- {KPI_SCENARIO_FILE}")
    print(f"- {KPI_PRIORITY_FILE}")
    print(f"- {KPI_PRIORITY_SCORE_FILE}")


if __name__ == "__main__":
    main()

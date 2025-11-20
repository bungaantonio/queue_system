from diagrams import Cluster, Diagram, Edge
from diagrams.programming.language import Csharp, Python, Javascript
from diagrams.programming.framework import Fastapi, React
from diagrams.programming.flowchart import ManualInput, Decision, Database, Document, StartEnd
from diagrams.onprem.inmemory import Redis

with Diagram("Sistema de Gestão de Filas com Biometria", show=False, direction="LR"):

    inicio = StartEnd("Início")

    # --- Camada Middleware ---
    with Cluster("Middleware Local (C# + SDK ZKTeco)"):
        mw = Csharp("Middleware")
        captura = ManualInput("Captura Digital")

        mw >> Edge(color="darkgreen", style="bold", label="captura") >> captura

    # --- Camada Servidor Backend ---
    with Cluster("Servidor Backend (FastAPI)"):
        api = Fastapi("API FastAPI")
        regras = Decision("Regras de Negócio")
        db = Database("PostgreSQL - Usuários/Fila/Auditoria")
        cache = Redis("Fila em Memória")

        api >> Edge(color="brown", style="dashed") >> regras
        regras >> Edge(color="black") >> db
        regras >> cache

    # --- Camada Frontend ---
    with Cluster("Frontend Operador (Web)"):
        front = React("Interface React")
        chamada = Document("Tela de Chamada")

        front >> chamada

    # --- Camada Auditoria ---
    with Cluster("Auditoria e Integridade"):
        auditor = Python("Auditoria HashChain")

    # Fluxos principais
    inicio >> Edge(label="cadastro (dados + digital)") >> mw
    mw >> Edge(color="darkblue", label="POST /queue/register, /queue/scan") >> api

    front >> Edge(color="darkorange", label="GET /queue/*, PUT /queue/next,/done") >> api
    mw >> Edge(color="firebrick", style="dotted", label="POST /biometrics/verify_called_user") >> api

    api >> Edge(label="eventos de auditoria") >> auditor

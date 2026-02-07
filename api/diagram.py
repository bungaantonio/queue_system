from diagrams import Diagram, Cluster, Node

with Diagram("Arquitetura do Sistema - Três Camadas", show=True, direction="LR"):

    # Frontend
    with Cluster("Frontend (Interfaces)"):
        react_admin = Node("Admin Interface")
        react_queue = Node("Queue Display")
        frontend_nodes = [react_admin, react_queue]

    # Middleware
    with Cluster("Middleware (Processamento de Dados)"):
        biometrics = Node("Validação Biométrica")
        json_conv = Node("Conversão JSON")
        middleware_nodes = [biometrics, json_conv]

    # Backend
    with Cluster("Backend (Regras de Negócio e Serviços)"):
        api = Node("API Gateway / Regras de Negócio")
        queue_mgmt = Node("Gestão de Fila")
        audit = Node("Auditoria / Logs")
        db = Node("Banco de Dados")
        backend_nodes = [api, queue_mgmt, audit, db]

    # Fluxo de dados
    for fe in frontend_nodes:
        fe >> api  # Frontend envia requisições para Backend

    biometrics >> json_conv >> api  # Middleware processa dados antes do Backend

    api >> queue_mgmt  # API envia para fila
    api >> audit       # API envia para auditoria
    queue_mgmt >> db   # Fila atualiza banco de dados

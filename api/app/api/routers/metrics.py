from typing import List

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import io
from datetime import datetime

from app.db.database import get_db
from app.core.permissions import require_roles
from app.helpers.response_helpers import ApiResponse, success_response
from app.models.enums import OperatorRole
from app.services.metrics_service import MetricsService

from app.schemas.metrics_schemas import AttendanceMetric

router = APIRouter()


@router.get("/dados", response_model=ApiResponse[List[AttendanceMetric]])
def get_dados_metricas(
    cenario: str = Query(
        "todos",
        description="Filtro de cenário (ex.: Cenario_A, Cenario_B, todos).",
    ),
    db: Session = Depends(get_db),
    current_user = Depends(require_roles(OperatorRole.AUDITOR)),
):
    # O serviço devolve uma LISTA de objetos, não um CSV
    result = MetricsService.get_lista_metricas(db, cenario)
    return success_response(result)


@router.get("/exportar-csv")
def exportar_metricas_para_csv(
    cenario: str = Query(
        "todos",
        description="Filtro de cenário (ex.: Cenario_A, Cenario_B, todos).",
    ),
    db: Session = Depends(get_db),
    current_user=Depends(require_roles(OperatorRole.AUDITOR)),
):
    """
    Exporta os logs de atendimento reais em formato CSV para análise de métricas.
    Gera as colunas: cenario, id, tipo, t_entrada, status, biometria, t_chamada, t_fim, espera_seg, atendimento_seg
    """
    # Gera o conteúdo CSV via serviço
    csv_data = MetricsService.exportar_metricas_atendimento_csv(db, cenario)

    # Prepara o stream de bytes para o download
    stream = io.BytesIO(csv_data.encode("utf-8"))

    filename = f"metrics_{cenario}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"

    return StreamingResponse(
        stream,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )

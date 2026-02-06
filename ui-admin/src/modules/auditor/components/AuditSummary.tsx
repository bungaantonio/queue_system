import { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { auditorGateway } from "../auditorGateway";
import type { AuditChainSummary } from "../types";

export const AuditSummary = () => {
  const [summary, setSummary] = useState<AuditChainSummary | null>(null);

  useEffect(() => {
    auditorGateway.getSummary().then(setSummary);
  }, []);

  if (!summary) return <Typography>Carregando...</Typography>;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Resumo da Auditoria</Typography>
        <Typography>Total de registros: {summary.total_records}</Typography>
        <Typography>Registros válidos: {summary.valid_records}</Typography>
        <Typography>Registros inválidos: {summary.invalid_records}</Typography>
        <Typography>
          Todos válidos? {summary.all_valid ? "Sim" : "Não"}
        </Typography>
      </CardContent>
    </Card>
  );
};

// src/modules/auditor/components/AuditList.tsx
import {
  List,
  Datagrid,
  TextField,
  DateField,
  FunctionField,
} from "react-admin";
import { Card, Skeleton, Alert } from "@mui/material";
import { AuditSummary } from "./AuditSummary";
import { AuditIntegrityBadge } from "./AuditIntegrityBadge";
import { useGetHeader } from "../hooks/useAuditSummary";
import type { AuditVerificationDetail } from "../types";
import { PageHeader } from "../../shared/components/PageHeader";
import { StatusChip } from "../../shared/components/StatusChip";
import { PageContainer } from "../../shared/components/PageContainer";
import {
  datagridBaseSx,
  listCardSx,
  listMainTransparentSx,
} from "../../shared/styles/listStyles";

export const AuditList = () => {
  const { summary, loading, error } = useGetHeader();

  return (
    <PageContainer>
      <PageHeader
        title="Integridade Operacional"
        description="Priorize eventos inválidos e confirme concatenação criptográfica."
      />

      {loading ? (
        <Skeleton variant="rounded" height={152} sx={{ mb: 2.5 }} />
      ) : null}
      {!loading && error ? (
        <Alert severity="warning" sx={{ mb: 2.5 }}>
          Falha ao carregar resumo da auditoria.
        </Alert>
      ) : null}
      {!loading && !error ? <AuditSummary summary={summary} /> : null}

      {summary && !summary.all_valid ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          Existem {summary.invalid_records} registros com integridade
          comprometida. Revise os eventos destacados abaixo.
        </Alert>
      ) : null}

      <List title="Auditoria e Histórico" sx={listMainTransparentSx}>
        <Card sx={{ ...listCardSx, borderRadius: 5 }}>
          <Datagrid
            rowClick="show"
            bulkActionButtons={false}
            rowSx={(record: AuditVerificationDetail) => ({
              bgcolor: record.valid
                ? "transparent"
                : "rgba(var(--mui-palette-error-mainChannel) / 0.04)",
            })}
            sx={{
              ...datagridBaseSx,
              "& .MuiTableCell-root": { py: 1.15 },
              "& .column-operator_id, & .column-user_id": {
                display: { xs: "none", md: "table-cell" },
              },
            }}
          >
            <TextField
              source="id"
              label="ID"
              sx={{
                fontWeight: 800,
                color: "text.disabled",
                fontSize: "0.7rem",
              }}
            />

            <FunctionField
              label="Evento"
              render={(record: AuditVerificationDetail) => (
                <StatusChip
                  label={String(record.action || "N/A").toUpperCase()}
                  color={record.valid ? "primary" : "error"}
                  variant={record.valid ? "outlined" : "filled"}
                />
              )}
            />

            <TextField source="operator_id" label="Operador" />
            <TextField source="user_id" label="Utente" />
            <DateField
              source="timestamp"
              label="Horário"
              showTime
              sx={{ color: "text.secondary" }}
            />
            <AuditIntegrityBadge source="valid" />
          </Datagrid>
        </Card>
      </List>
    </PageContainer>
  );
};

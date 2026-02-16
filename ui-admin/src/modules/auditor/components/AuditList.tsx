// src/modules/auditor/components/AuditList.tsx
import {
  List,
  Datagrid,
  TextField,
  DateField,
  Title,
  FunctionField,
} from "react-admin";
import {
  Box,
  Card,
  Typography,
  Stack,
  Chip,
  Skeleton,
  Alert,
  alpha,
} from "@mui/material";
import { AuditSummary } from "./AuditSummary";
import { AuditIntegrityBadge } from "./AuditIntegrityBadge";
import { useGetHeader } from "../hooks/useAuditSummary";
import type { AuditVerificationDetail } from "../types";

export const AuditList = () => {
  const { summary, loading, error } = useGetHeader();

  return (
    <Box>
      <Title title="Auditoria e Histórico" />

      <Stack spacing={1.5} sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          Integridade Operacional
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Priorize eventos inválidos e confirme concatenação criptográfica.
        </Typography>
      </Stack>

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

      <List
        sx={{ "& .RaList-main": { boxShadow: "none", bgcolor: "transparent" } }}
      >
        <Card
          sx={{
            borderRadius: 5,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          <Datagrid
            rowClick="show"
            bulkActionButtons={false}
            rowSx={(record: AuditVerificationDetail) => ({
              bgcolor: record.valid ? "transparent" : alpha("#e11d48", 0.04),
            })}
            sx={{
              "& .MuiTableCell-head": { bgcolor: "background.default" },
              "& .MuiTableCell-root": { py: 1.15 },
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
                <Chip
                  size="small"
                  label={String(record.action || "N/A").toUpperCase()}
                  color={record.valid ? "primary" : "error"}
                  variant={record.valid ? "outlined" : "filled"}
                  sx={{
                    height: 22,
                    "& .MuiChip-label": {
                      px: 1,
                      fontSize: "0.62rem",
                      fontWeight: 900,
                    },
                  }}
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
    </Box>
  );
};

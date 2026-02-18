// src/modules/auditor/components/AuditShow.tsx
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  useRecordContext,
  FunctionField,
} from "react-admin";
import {
  Box,
  Typography,
  Grid,
  Paper,
  alpha,
  Stack,
  Alert,
} from "@mui/material";
import { AuditIntegrityBadge } from "./AuditIntegrityBadge";
import { Terminal, Link2 } from "lucide-react";
import type { AuditVerificationDetail } from "../types";
import { PageHeader } from "../../shared/components/PageHeader";
import { StatusChip } from "../../shared/components/StatusChip";
import { PageContainer } from "../../shared/components/PageContainer";

const TechnicalField = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{ mb: 1.5 }}>
    <Typography
      variant="caption"
      sx={{ fontWeight: 800, color: "text.disabled", letterSpacing: 1 }}
    >
      {label.toUpperCase()}
    </Typography>
    <Paper
      elevation={0}
      sx={{
        p: 1.25,
        mt: 0.5,
        bgcolor: "grey.50",
        border: "1px solid",
        borderColor: "divider",
        fontFamily: "monospace",
        fontSize: "0.75rem",
        color: "text.secondary",
        wordBreak: "break-all",
      }}
    >
      {value || "---"}
    </Paper>
  </Box>
);

export const AuditShow = () => (
  <Show
    sx={{
      "& .RaShow-main": { boxShadow: "none", bgcolor: "transparent", p: 0 },
    }}
  >
    <PageContainer sx={{ maxWidth: 1120, mx: "auto" }}>
      <PageHeader
        title="Evento de Auditoria"
        description="Inspeção técnica do encadeamento e da prova criptográfica."
      />

      <AuditStatusHeader />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 2, borderRadius: 5 }}>
            <Stack spacing={1.5}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 800, color: "primary.main" }}
              >
                METADADOS
              </Typography>
              <SimpleShowLayout sx={{ p: 0 }}>
                <FunctionField
                  label="Ação"
                  render={(record: AuditVerificationDetail) => (
                    <StatusChip
                      label={String(record.action || "N/A").toUpperCase()}
                      color={record.valid ? "primary" : "error"}
                      variant={record.valid ? "outlined" : "filled"}
                    />
                  )}
                />
                <DateField source="timestamp" label="Data e Hora" showTime />
                <TextField source="operator_id" label="Operador" />
                <TextField source="user_id" label="Utente" />
                <TextField source="queue_item_id" label="Item da Fila" />
              </SimpleShowLayout>
              <AuditIntegrityBadge source="valid" />
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 5,
              bgcolor: (theme) => alpha(theme.palette.text.primary, 0.02),
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 1.25 }}
            >
              <Terminal size={18} color="var(--mui-palette-text-secondary)" />
              <Typography variant="subtitle2">PROVA CRIPTOGRÁFICA</Typography>
            </Stack>
            <AuditRecordContent />
          </Paper>
        </Grid>
      </Grid>
    </PageContainer>
  </Show>
);

const AuditStatusHeader = () => {
  const record = useRecordContext<AuditVerificationDetail>();
  if (!record) return null;

  const hasChainIssue = !record.previous_hash_matches || !record.valid;
  return (
    <Alert
      severity={hasChainIssue ? "error" : "success"}
      sx={{ mb: 2, borderRadius: 3 }}
      icon={<Link2 size={16} />}
    >
      {hasChainIssue
        ? "Inconsistência detectada na cadeia. Priorize verificação manual."
        : "Encadeamento e hash verificados com sucesso."}
    </Alert>
  );
};

const AuditRecordContent = () => {
  const record = useRecordContext<AuditVerificationDetail>();
  if (!record) return null;

  return (
    <Stack spacing={1.5}>
      <TechnicalField label="Hash Armazenado" value={record.stored_hash} />
      <TechnicalField
        label="Hash Recalculado"
        value={record.recalculated_hash}
      />

      <Box
        sx={{
          p: 1.25,
          borderRadius: 2.5,
          bgcolor: record.previous_hash_matches
            ? (theme) => alpha(theme.palette.success.main, 0.1)
            : (theme) => alpha(theme.palette.error.main, 0.1),
          border: "1px solid",
          borderColor: record.previous_hash_matches
            ? (theme) => alpha(theme.palette.success.main, 0.24)
            : (theme) => alpha(theme.palette.error.main, 0.24),
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 900,
            color: record.previous_hash_matches ? "success.dark" : "error.dark",
          }}
        >
          CONCATENAÇÃO COM HASH ANTERIOR:{" "}
          {record.previous_hash_matches ? "VÁLIDA" : "FALHA"}
        </Typography>
      </Box>

      {record.details ? (
        <TechnicalField
          label="Detalhes do Evento"
          value={JSON.stringify(record.details, null, 2)}
        />
      ) : null}
    </Stack>
  );
};

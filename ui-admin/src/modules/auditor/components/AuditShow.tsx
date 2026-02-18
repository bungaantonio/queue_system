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
        borderRadius: 2,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "3px",
          bgcolor: "primary.main",
          opacity: 0.35,
        },
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
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: (theme) => alpha(theme.palette.divider, 0.9),
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(
                  theme.palette.background.default,
                  0.6,
                )} 100%)`,
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "6px",
                bgcolor: "primary.main",
              },
            }}
          >
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
              borderRadius: 2,
              border: "1px solid",
              borderColor: (theme) => alpha(theme.palette.divider, 0.9),
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(
                  theme.palette.background.default,
                  0.6,
                )} 100%)`,
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "6px",
                bgcolor: "secondary.main",
              },
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
  const tone = hasChainIssue ? "error" : "success";
  return (
    <Paper
      elevation={0}
      sx={{
        mb: 2,
        p: 1.5,
        borderRadius: 2,
        border: "1px solid",
        borderColor: (theme) => alpha(theme.palette[tone].main, 0.35),
        background: (theme) =>
          `linear-gradient(135deg, ${alpha(
            theme.palette[tone].main,
            0.16,
          )} 0%, ${alpha(theme.palette.background.paper, 0.96)} 100%)`,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "6px",
          bgcolor: (theme) => theme.palette[tone].main,
        },
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Link2 size={16} color="var(--mui-palette-text-secondary)" />
        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
          {hasChainIssue ? "ATENÇÃO IMEDIATA" : "CADEIA ESTÁVEL"}
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {hasChainIssue
          ? "Inconsistência detectada na cadeia. Priorize verificação manual."
          : "Encadeamento e hash verificados com sucesso."}
      </Typography>
    </Paper>
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

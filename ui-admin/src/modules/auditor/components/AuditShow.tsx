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
  Divider,
} from "@mui/material";
import { AuditIntegrityBadge } from "./AuditIntegrityBadge";
import { ShieldAlert, ShieldCheck, Terminal } from "lucide-react";
import type { AuditVerificationDetail } from "../types";
import { PageHeader } from "../../shared/components/PageHeader";
import { StatusChip } from "../../shared/components/StatusChip";
import { PageContainer } from "../../shared/components/PageContainer";

// Campo técnico com fonte monoespaçada — para hashes e dados criptográficos
const HashField = ({ label, value }: { label: string; value: string }) => (
  <Box>
    <Typography
      variant="caption"
      sx={{
        fontWeight: 700,
        color: "text.disabled",
        letterSpacing: "0.08em",
        display: "block",
        mb: 0.5,
      }}
    >
      {label.toUpperCase()}
    </Typography>
    <Box
      sx={{
        p: 1.25,
        bgcolor: (theme) => alpha(theme.palette.background.default, 0.8),
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1.5,
        fontFamily: "monospace",
        fontSize: "0.72rem",
        color: "text.secondary",
        wordBreak: "break-all",
        lineHeight: 1.6,
      }}
    >
      {value || "—"}
    </Box>
  </Box>
);

// Banner de estado — primeiro elemento, peso visual máximo
const ChainStatusBanner = () => {
  const record = useRecordContext<AuditVerificationDetail>();
  if (!record) return null;

  const ok = record.valid && record.previous_hash_matches;
  const color = ok ? "success" : "error";
  const Icon = ok ? ShieldCheck : ShieldAlert;

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 2,
        p: 2,
        borderRadius: 2,
        border: "2px solid",
        borderColor: (theme) => alpha(theme.palette[color].main, 0.4),
        background: (theme) =>
          `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.08)} 0%, ${theme.palette.background.paper} 100%)`,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "5px",
          bgcolor: (theme) => theme.palette[color].main,
        },
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="flex-start">
        <Icon
          size={20}
          strokeWidth={2.5}
          style={{ flexShrink: 0, marginTop: 2 }}
          color={
            ok
              ? "var(--mui-palette-success-main)"
              : "var(--mui-palette-error-main)"
          }
        />
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 900, lineHeight: 1.2 }}
          >
            {ok ? "Cadeia íntegra" : "Integridade comprometida"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
            {ok
              ? "Encadeamento e hash verificados com sucesso. Sem anomalias detectadas."
              : "Inconsistência detectada na cadeia criptográfica. Priorize verificação manual deste registo."}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

// Metadados do evento
const MetadataPanel = () => {
  const record = useRecordContext<AuditVerificationDetail>();
  if (!record) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        height: "100%",
        borderRadius: 2,
        border: "1px solid",
        borderColor: (theme) => alpha(theme.palette.divider, 0.8),
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "4px",
          bgcolor: "primary.main",
        },
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: 800,
          color: "primary.main",
          letterSpacing: "0.08em",
          display: "block",
          mb: 1.5,
        }}
      >
        METADADOS
      </Typography>

      <SimpleShowLayout sx={{ p: 0 }}>
        <FunctionField
          label="Evento"
          render={(r: AuditVerificationDetail) => (
            <StatusChip
              label={String(r.action || "N/A").toUpperCase()}
              color={r.valid ? "primary" : "error"}
              variant={r.valid ? "outlined" : "filled"}
            />
          )}
        />
        <DateField source="timestamp" label="Data e hora" showTime />
        <TextField source="operator_id" label="Operador" />
        <TextField source="user_id" label="Utente" />
        <TextField source="queue_item_id" label="Item da fila" />
      </SimpleShowLayout>

      <Divider sx={{ my: 1.5 }} />
      <AuditIntegrityBadge source="valid" />
    </Paper>
  );
};

// Prova criptográfica
const CryptoPanel = () => {
  const record = useRecordContext<AuditVerificationDetail>();
  if (!record) return null;

  const hashMatch = record.previous_hash_matches;
  const matchColor = hashMatch ? "success" : "error";

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        height: "100%",
        borderRadius: 2,
        border: "1px solid",
        borderColor: (theme) => alpha(theme.palette.divider, 0.8),
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "4px",
          bgcolor: "secondary.main",
        },
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Terminal size={15} color="var(--mui-palette-text-secondary)" />
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            color: "text.secondary",
            letterSpacing: "0.08em",
          }}
        >
          PROVA CRIPTOGRÁFICA
        </Typography>
      </Stack>

      <Stack spacing={1.75}>
        <HashField label="Hash armazenado" value={record.stored_hash} />
        <HashField label="Hash recalculado" value={record.recalculated_hash} />

        {/* Resultado da concatenação */}
        <Box
          sx={{
            px: 1.5,
            py: 1,
            borderRadius: 1.5,
            border: "1px solid",
            borderColor: (theme) => alpha(theme.palette[matchColor].main, 0.3),
            bgcolor: (theme) => alpha(theme.palette[matchColor].main, 0.06),
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {hashMatch ? (
            <ShieldCheck
              size={14}
              color="var(--mui-palette-success-main)"
              strokeWidth={2.5}
            />
          ) : (
            <ShieldAlert
              size={14}
              color="var(--mui-palette-error-main)"
              strokeWidth={2.5}
            />
          )}
          <Typography
            sx={{
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: "0.68rem",
              letterSpacing: "0.06em",
              color: (theme) => theme.palette[matchColor].dark,
            }}
          >
            CONCATENAÇÃO COM HASH ANTERIOR: {hashMatch ? "VÁLIDA" : "FALHOU"}
          </Typography>
        </Box>

        {record.details && (
          <HashField
            label="Detalhes do evento"
            value={JSON.stringify(record.details, null, 2)}
          />
        )}
      </Stack>
    </Paper>
  );
};

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

      <ChainStatusBanner />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetadataPanel />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <CryptoPanel />
        </Grid>
      </Grid>
    </PageContainer>
  </Show>
);

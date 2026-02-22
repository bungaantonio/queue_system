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
  useTheme,
} from "@mui/material";
import { AuditIntegrityBadge } from "./AuditIntegrityBadge";
import { ShieldAlert, ShieldCheck, Terminal, Search } from "lucide-react"; // Adicionei Search
import type { AuditVerificationDetail } from "../types";
import { PageHeader } from "../../shared/components/PageHeader";
import { StatusChip } from "../../shared/components/StatusChip";
import { PageContainer } from "../../shared/components/PageContainer";

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

const ChainStatusBanner = () => {
  const record = useRecordContext<AuditVerificationDetail>();
  if (!record) return null;

  // Simplificado: valid já contém a verificação de hash e de cadeia
  const ok = record.valid;
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
          color={`var(--mui-palette-${color}-main)`}
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
              : "Inconsistência detectada na prova criptográfica. Priorize verificação manual deste registo."}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

// NOVO: Exibe as conclusões do auditor se o evento foi investigado
const InvestigationPanel = () => {
  const record = useRecordContext<AuditVerificationDetail>();
  const theme = useTheme();
  if (!record || !record.investigation_note) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mt: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: alpha(theme.palette.warning.main, 0.4),
        bgcolor: alpha(theme.palette.warning.main, 0.04),
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Search size={14} color={theme.palette.warning.dark} />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              color: "warning.dark",
              letterSpacing: "0.05em",
            }}
          >
            CONCLUSÃO DA INVESTIGAÇÃO
          </Typography>
        </Stack>
        <Typography
          variant="body2"
          sx={{ fontStyle: "italic", color: "text.primary", fontWeight: 500 }}
        >
          "{record.investigation_note}"
        </Typography>
        <Divider sx={{ opacity: 0.4, my: 0.5 }} />
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: "0.65rem" }}
        >
          Validado por Operador #{record.investigated_by_id} em{" "}
          {new Date(record.investigated_at!).toLocaleString()}
        </Typography>
      </Stack>
    </Paper>
  );
};

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
        <TextField source="operator_username" label="Operador" />
        <TextField source="user_name" label="Utente" />
        <TextField source="queue_item_id" label="Item da fila" />
      </SimpleShowLayout>

      <Divider sx={{ my: 1.5 }} />
      <AuditIntegrityBadge source="valid" />

      {/* Adicionado aqui para aparecer no painel lateral */}
      <InvestigationPanel />
    </Paper>
  );
};

const CryptoPanel = () => {
  const record = useRecordContext<AuditVerificationDetail>();
  if (!record) return null;

  const chainOk = record.previous_hash_matches;
  const contentOk = record.content_integrity;

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

      <Stack spacing={2}>
        <HashField
          label="Hash armazenado (Assinatura)"
          value={record.stored_hash}
        />
        <HashField
          label="Hash recalculado (Verificação)"
          value={record.recalculated_hash}
        />

        <Divider />

        <Stack spacing={1}>
          <Box
            sx={{
              px: 1.5,
              py: 1,
              borderRadius: 1.5,
              border: "1px solid",
              borderColor: (theme) =>
                alpha(theme.palette[contentOk ? "success" : "error"].main, 0.3),
              bgcolor: (theme) =>
                alpha(
                  theme.palette[contentOk ? "success" : "error"].main,
                  0.04,
                ),
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            {contentOk ? (
              <ShieldCheck size={16} color="green" />
            ) : (
              <ShieldAlert size={16} color="red" />
            )}
            <Typography
              sx={{
                fontFamily: "monospace",
                fontWeight: 700,
                fontSize: "0.7rem",
                color: contentOk ? "success.dark" : "error.main",
              }}
            >
              ASSINATURA DOS DADOS:{" "}
              {contentOk
                ? "ÍNTEGRA (SEM ALTERAÇÕES)"
                : "CORROMPIDA (DADOS ADULTERADOS)"}
            </Typography>
          </Box>

          <Box
            sx={{
              px: 1.5,
              py: 1,
              borderRadius: 1.5,
              border: "1px solid",
              borderColor: (theme) =>
                alpha(theme.palette[chainOk ? "success" : "error"].main, 0.3),
              bgcolor: (theme) =>
                alpha(theme.palette[chainOk ? "success" : "error"].main, 0.04),
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            {chainOk ? (
              <ShieldCheck size={16} color="green" />
            ) : (
              <ShieldAlert size={16} color="red" />
            )}
            <Typography
              sx={{
                fontFamily: "monospace",
                fontWeight: 700,
                fontSize: "0.7rem",
                color: chainOk ? "success.dark" : "error.main",
              }}
            >
              ELO COM ANTERIOR:{" "}
              {chainOk
                ? "VÁLIDO (SEQUÊNCIA PRESERVADA)"
                : "QUEBRADO (HISTÓRICO INTERROMPIDO)"}
            </Typography>
          </Box>
        </Stack>

        {record.details && (
          <Box sx={{ mt: 1 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: "text.disabled",
                display: "block",
                mb: 0.5,
              }}
            >
              ESTRUTURA CANÓNICA DOS DETALHES
            </Typography>
            <Box
              sx={{
                p: 1.25,
                bgcolor: "action.hover",
                borderRadius: 1.5,
                fontSize: "0.7rem",
                fontFamily: "monospace",
              }}
            >
              <pre style={{ margin: 0 }}>
                {JSON.stringify(record.details, null, 2)}
              </pre>
            </Box>
          </Box>
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

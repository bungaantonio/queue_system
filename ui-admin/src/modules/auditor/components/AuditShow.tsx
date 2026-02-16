// src/modules/auditor/components/AuditShow.tsx
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  useRecordContext,
} from "react-admin";
import { Box, Typography, Grid, Paper, alpha, Stack } from "@mui/material";
import { AuditIntegrityBadge } from "./AuditIntegrityBadge";
import { Terminal } from "lucide-react";

const TechnicalField = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{ mb: 2 }}>
    <Typography
      variant="caption"
      sx={{ fontWeight: 800, color: "text.disabled", letterSpacing: 1 }}
    >
      {label.toUpperCase()}
    </Typography>
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
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
    sx={{ "& .RaShow-main": { boxShadow: "none", bgcolor: "transparent" } }}
  >
    <Box sx={{ maxWidth: 1080 }}>
      <Typography variant="h4" sx={{ mb: 2.5 }}>
        Detalhes do Evento
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 2.5, borderRadius: 5 }}>
            <Stack spacing={2}>
              <Box>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 800, color: "primary.main" }}
                >
                  METADADOS
                </Typography>
                <SimpleShowLayout sx={{ p: 0 }}>
                  <TextField
                    source="action"
                    label="Operação"
                    sx={{ fontWeight: 700, fontSize: "1.2rem" }}
                  />
                  <DateField source="timestamp" label="Data e Hora" showTime />
                  <TextField
                    source="operator_id"
                    label="Operador Responsável"
                  />
                </SimpleShowLayout>
              </Box>
              <AuditIntegrityBadge source="valid" />
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 5,
              bgcolor: (theme) => alpha(theme.palette.text.primary, 0.02),
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Terminal size={18} color="var(--fcc-stable)" />
              <Typography variant="subtitle2">PROVA CRIPTOGRÁFICA</Typography>
            </Stack>

            <AuditRecordContent />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  </Show>
);

const AuditRecordContent = () => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <>
      <TechnicalField label="Hash Armazenado" value={record.stored_hash} />
      <TechnicalField
        label="Hash Recalculado"
        value={record.recalculated_hash}
      />
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Box
          sx={{
            flex: 1,
            p: 2,
            borderRadius: 3,
            bgcolor: record.previous_hash_matches
              ? (theme) => alpha(theme.palette.success.main, 0.1)
              : (theme) => alpha(theme.palette.error.main, 0.1),
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              color: record.previous_hash_matches
                ? "success.main"
                : "error.main",
            }}
          >
            CONCATENAÇÃO ANTERIOR:{" "}
            {record.previous_hash_matches ? "OK" : "FALHA"}
          </Typography>
        </Box>
      </Stack>
    </>
  );
};

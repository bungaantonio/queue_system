// src/modules/auditor/components/AuditIntegrityBadge.tsx
import {
  Typography,
  Stack,
  alpha,
  useTheme,
  Tooltip,
  Box,
} from "@mui/material";
import {
  ShieldCheck,
  ShieldAlert,
  Terminal,
  Link as LinkIcon,
} from "lucide-react";
import { useRecordContext } from "react-admin";
import type { AuditVerificationDetail } from "../types";

export const AuditIntegrityBadge = ({
  source = "valid",
  value,
}: {
  source?: string;
  value?: boolean;
}) => {
  const theme = useTheme();
  const record = useRecordContext<AuditVerificationDetail>();

  // Determina o estado baseado no registro ou no valor passado
  const isValid =
    value ?? Boolean(record?.[source as keyof AuditVerificationDetail]);

  // Se não houver registro (ex: carregando), retorna null
  if (!record && value === undefined) return null;

  const color = isValid ? theme.palette.success.main : theme.palette.error.main;
  const Icon = isValid ? ShieldCheck : ShieldAlert;

  // Diagnóstico detalhado para o caso de violação
  const hasContentError = record && !record.content_integrity;
  const hasChainError = record && !record.previous_hash_matches;

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Stack
        direction="row"
        spacing={0.75}
        alignItems="center"
        sx={{
          px: 1.25,
          py: 0.6,
          borderRadius: 1.5,
          bgcolor: alpha(color, 0.08),
          border: "1px solid",
          borderColor: alpha(color, 0.25),
          width: "fit-content",
        }}
      >
        <Icon size={13} color={color} strokeWidth={2.5} />
        <Typography
          sx={{
            fontFamily: "monospace",
            fontWeight: 700,
            color,
            fontSize: "0.62rem",
            letterSpacing: "0.08em",
          }}
        >
          {isValid ? "ÍNTEGRO" : "VIOLAÇÃO"}
        </Typography>
      </Stack>

      {/* Indicadores técnicos de causa raiz (apenas em caso de erro) */}
      {!isValid && record && (
        <Stack direction="row" spacing={0.5}>
          {hasContentError && (
            <Tooltip title="Assinatura corrompida: Os dados deste registro foram alterados.">
              <Box sx={{ display: "flex", color: "error.main", opacity: 0.7 }}>
                <Terminal size={14} strokeWidth={2.5} />
              </Box>
            </Tooltip>
          )}
          {hasChainError && (
            <Tooltip title="Elo quebrado: A conexão com o registro anterior falhou (registro removido ou hash anterior inválido).">
              <Box sx={{ display: "flex", color: "error.main", opacity: 0.7 }}>
                <LinkIcon size={14} strokeWidth={2.5} />
              </Box>
            </Tooltip>
          )}
        </Stack>
      )}
    </Stack>
  );
};

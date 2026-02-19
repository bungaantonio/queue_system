// src/modules/auditor/components/AuditList.tsx
import {
  List,
  Datagrid,
  TextField,
  DateField,
  FunctionField,
} from "react-admin";
import type { SxProps, Theme } from "@mui/material";
import {
  Box,
  Paper,
  Skeleton,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { ShieldAlert, Clock } from "lucide-react";
import { AuditSummary } from "./AuditSummary";
import { AuditIntegrityBadge } from "./AuditIntegrityBadge";
import { useGetHeader } from "../hooks/useAuditSummary";
import type { AuditVerificationDetail } from "../types";
import { PageHeader } from "../../shared/components/PageHeader";
import { StatusChip } from "../../shared/components/StatusChip";
import { PageContainer } from "../../shared/components/PageContainer";
import {
  datagridBaseSx,
  datagridHoverSx,
  listMainTransparentSx,
} from "../../shared/styles/listStyles";

export const AuditList = () => {
  const { summary, loading, error } = useGetHeader();
  const theme = useTheme();

  return (
    <PageContainer>
      <PageHeader
        title="Integridade Operacional"
        description="Priorize eventos inválidos e confirme concatenação criptográfica."
      />

      {loading && <Skeleton variant="rounded" height={152} sx={{ mb: 2.5 }} />}

      {!loading && !!error && (
        <AuditCallout
          tone="warning"
          title="Resumo indisponível"
          description="Falha ao carregar o resumo da auditoria."
          sx={{ mb: 2.5 }}
        />
      )}

      {!loading && !error && <AuditSummary summary={summary} />}

      {summary && !summary.all_valid && (
        <AuditCallout
          tone="error"
          title="Integridade comprometida"
          description={`${summary.invalid_records} registo(s) com integridade comprometida. Revise os eventos destacados abaixo.`}
          sx={{ mb: 2 }}
        />
      )}

      <List title="Auditoria e Histórico" sx={listMainTransparentSx}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            border: "1px solid",
            borderColor: alpha(theme.palette.divider, 0.8),
            overflow: "hidden",
          }}
        >
          {/* Cabeçalho */}
          <Box
            sx={{
              px: 2.5,
              py: 1.75,
              borderBottom: "1px solid",
              borderColor: alpha(theme.palette.divider, 0.6),
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: alpha(theme.palette.primary.main, 0.03),
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                }}
              >
                <Clock size={16} />
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 800, lineHeight: 1.2 }}
                >
                  Linha do tempo de auditoria
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Eventos ordenados por horário
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Datagrid
            rowClick="show"
            bulkActionButtons={false}
            rowSx={(record: AuditVerificationDetail) =>
              record.valid
                ? {}
                : { bgcolor: alpha(theme.palette.error.main, 0.04) }
            }
            sx={{
              ...datagridBaseSx,
              ...datagridHoverSx,
              "& .RaDatagrid-root": { boxShadow: "none" },
              "& .RaDatagrid-tableWrapper": {
                maxHeight: "60vh",
                overflow: "auto",
              },
              "& .column-operator_id, & .column-user_id": {
                display: { xs: "none", md: "table-cell" },
              },
            }}
          >
            <TextField
              source="id"
              label="ID"
              sx={{
                fontWeight: 700,
                color: "text.disabled",
                fontSize: "0.75rem",
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
        </Paper>
      </List>
    </PageContainer>
  );
};

const AuditCallout = ({
  title,
  description,
  tone,
  sx,
}: {
  title: string;
  description: string;
  tone: "warning" | "error";
  sx?: SxProps<Theme>;
}) => {
  const theme = useTheme();
  const color =
    tone === "warning" ? theme.palette.warning.main : theme.palette.error.main;

  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="flex-start"
      sx={{
        p: 1.5,
        borderRadius: 2,
        border: "1px solid",
        borderColor: alpha(color, 0.3),
        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.04)} 100%)`,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "4px",
          bgcolor: color,
        },
        ...sx,
      }}
    >
      <ShieldAlert
        size={16}
        color={color}
        style={{ marginTop: 2, flexShrink: 0 }}
      />
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Stack>
  );
};

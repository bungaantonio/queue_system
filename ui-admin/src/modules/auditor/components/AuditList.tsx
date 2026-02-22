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
  Tooltip,
} from "@mui/material";
import { ShieldAlert, ShieldCheck, Search } from "lucide-react";
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
  const { summary, loading, error } = useGetHeader() as {
    summary: ReturnType<typeof useGetHeader>["summary"];
    loading: boolean;
    error: Error | null;
  };
  const theme = useTheme();

  return (
    <PageContainer>
      <PageHeader
        title="Integridade Operacional"
        description="Monitorização de provas criptográficas e gestão de incidentes de integridade."
      />

      {loading && <Skeleton variant="rounded" height={180} sx={{ mb: 2.5 }} />}
      {!loading && error && (
        <AuditCallout
          tone="warning"
          title="Resumo indisponível"
          description="Falha ao sincronizar com o serviço de validação de cadeia."
          sx={{ mb: 2.5 }}
        />
      )}
      {!loading && !error && <AuditSummary summary={summary} />}

      <List
        title="Auditoria e Histórico"
        sx={listMainTransparentSx}
        sort={{ field: "timestamp", order: "DESC" }} // Mostrar os mais recentes primeiro
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            border: "1px solid",
            borderColor: alpha(theme.palette.divider, 0.8),
            overflow: "hidden",
          }}
        >
          {/* Cabeçalho técnico do Datagrid */}
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
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 800, lineHeight: 1.2 }}
              >
                Registo de Eventos Auditados
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Verificação em tempo real · Clique para inspeção forense
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5}>
              {summary && !summary.all_valid && (
                <Stack
                  direction="row"
                  spacing={0.75}
                  alignItems="center"
                  sx={{
                    px: 1.25,
                    py: 0.6,
                    borderRadius: 1.5,
                    bgcolor: alpha(theme.palette.error.main, 0.08),
                    border: "1px solid",
                    borderColor: alpha(theme.palette.error.main, 0.25),
                  }}
                >
                  <ShieldAlert size={13} color={theme.palette.error.main} />
                  <Typography
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: 700,
                      fontSize: "0.65rem",
                      color: "error.main",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {summary.invalid_records} VIOLAÇÃO(ÕES) DETECTADA(S)
                  </Typography>
                </Stack>
              )}
              {summary?.all_valid && (
                <Stack
                  direction="row"
                  spacing={0.75}
                  alignItems="center"
                  sx={{
                    px: 1.25,
                    py: 0.6,
                    borderRadius: 1.5,
                    bgcolor: alpha(theme.palette.success.main, 0.08),
                    border: "1px solid",
                    borderColor: alpha(theme.palette.success.main, 0.25),
                  }}
                >
                  <ShieldCheck size={13} color={theme.palette.success.main} />
                  <Typography
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: 700,
                      fontSize: "0.65rem",
                      color: "success.dark",
                      letterSpacing: "0.06em",
                    }}
                  >
                    CADEIA TOTALMENTE ÍNTEGRA
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Box>

          <Datagrid
            rowClick="show"
            bulkActionButtons={false}
            rowSx={(record: AuditVerificationDetail) => {
              if (record.valid) return {};
              // Se for inválido mas já tiver nota, usa um tom de alerta mais suave (laranja)
              // Se for inválido e SEM nota, usa o tom de erro forte (vermelho)
              const hasNote = !!record.investigation_note;
              const color = hasNote
                ? theme.palette.warning.main
                : theme.palette.error.main;

              return {
                bgcolor: alpha(color, 0.05),
                borderLeft: `4px solid ${color}`,
                transition: "background-color 0.2s",
                "&:hover": { bgcolor: alpha(color, 0.08) },
              };
            }}
            sx={{
              ...datagridBaseSx,
              ...datagridHoverSx,
              "& .RaDatagrid-root": { boxShadow: "none" },
              "& .MuiTableCell-head": {
                bgcolor: "background.paper",
                fontWeight: 700,
              },
            }}
          >
            <TextField
              source="id"
              label="ID"
              sx={{
                fontFamily: "monospace",
                fontWeight: 700,
                color: "text.disabled",
                fontSize: "0.75rem",
              }}
            />

            <FunctionField
              label="Evento"
              render={(record: AuditVerificationDetail) => (
                <Stack direction="row" spacing={1} alignItems="center">
                  <StatusChip
                    label={String(record.action || "N/A").toUpperCase()}
                    color={record.valid ? "primary" : "error"}
                    variant={record.valid ? "outlined" : "filled"}
                  />
                  {/* Ícone de Investigação: mostra se o auditor já tratou o caso */}
                  {record.investigation_note && (
                    <Tooltip title="Evento com nota de investigação técnica">
                      <Search size={14} color={theme.palette.warning.main} />
                    </Tooltip>
                  )}
                </Stack>
              )}
            />

            <TextField source="operator_username" label="Operador" />
            <TextField source="user_name" label="Utente" />

            <DateField
              source="timestamp"
              label="Horário"
              showTime
              sx={{
                fontFamily: "monospace",
                fontSize: "0.8rem",
                color: "text.secondary",
              }}
            />

            {/* O Badge agora mostra ícones de causa raiz (Dados vs Cadeia) conforme atualizámos antes */}
            <AuditIntegrityBadge source="valid" />

            {/* Nova coluna para ver quem investigou diretamente na lista */}
            <FunctionField
              label="Análise"
              render={(record: AuditVerificationDetail) =>
                record.investigated_by_id ? (
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, color: "text.secondary" }}
                  >
                    Revisto #{record.investigated_by_id}
                  </Typography>
                ) : record.valid ? null : (
                  <Typography
                    variant="caption"
                    sx={{ color: "error.main", fontWeight: 700 }}
                  >
                    PENDENTE
                  </Typography>
                )
              }
            />
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
  const Icon = tone === "warning" ? ShieldAlert : ShieldAlert;

  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="flex-start"
      sx={{
        p: 1.75,
        borderRadius: 2,
        border: "1px solid",
        borderColor: alpha(color, 0.3),
        bgcolor: alpha(color, 0.06),
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
      <Icon size={16} color={color} style={{ marginTop: 2, flexShrink: 0 }} />
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          {description}
        </Typography>
      </Box>
    </Stack>
  );
};

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
  Card,
  Skeleton,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
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
  const theme = useTheme();

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
        <AuditCallout
          tone="warning"
          title="Resumo indisponível"
          description="Falha ao carregar o resumo da auditoria."
          sx={{ mb: 2.5 }}
        />
      ) : null}
      {!loading && !error ? <AuditSummary summary={summary} /> : null}

      {summary && !summary.all_valid ? (
        <AuditCallout
          tone="error"
          title="Integridade comprometida"
          description={`Existem ${summary.invalid_records} registros com integridade comprometida. Revise os eventos destacados abaixo.`}
          sx={{ mb: 2 }}
        />
      ) : null}

      <List title="Auditoria e Histórico" sx={listMainTransparentSx}>
        <Card
          sx={{
            ...listCardSx,
            borderRadius: 2,
            border: "1px solid",
            borderColor: alpha(theme.palette.divider, 0.9),
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(
              theme.palette.background.default,
              0.5,
            )} 100%)`,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              background: `repeating-linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.05,
              )} 0px, ${alpha(
                theme.palette.primary.main,
                0.05,
              )} 6px, transparent 6px, transparent 14px)`,
              opacity: 0.35,
              pointerEvents: "none",
            },
          }}
        >
          <Box
            sx={{
              px: { xs: 2, md: 2.5 },
              pt: { xs: 2, md: 2.5 },
              pb: 1,
              borderBottom: "1px solid",
              borderColor: alpha(theme.palette.divider, 0.8),
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                Linha do tempo de auditoria
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Eventos ordenados por horário
              </Typography>
            </Box>
            <Box
              sx={{
                height: 6,
                width: 44,
                borderRadius: 1,
                bgcolor: theme.palette.primary.main,
                boxShadow: `0 0 0 4px ${alpha(
                  theme.palette.primary.main,
                  0.15,
                )}`,
              }}
            />
          </Box>
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
              position: "relative",
              zIndex: 1,
              "& .MuiTableCell-root": { py: 1.15 },
              "& .MuiTableHead-root": {
                position: "sticky",
                top: 0,
                zIndex: 2,
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(
                  theme.palette.background.default,
                  0.6,
                )} 100%)`,
              },
              "& .MuiTableCell-head": {
                textTransform: "uppercase",
                fontSize: "0.68rem",
                letterSpacing: "0.1em",
              },
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
  const toneColor =
    tone === "warning"
      ? theme.palette.warning.main
      : theme.palette.error.main;
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2,
        border: "1px solid",
        borderColor: alpha(toneColor, 0.4),
        background: `linear-gradient(135deg, ${alpha(
          toneColor,
          0.16,
        )} 0%, ${alpha(toneColor, 0.06)} 100%)`,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "6px",
          bgcolor: toneColor,
        },
        ...sx,
      }}
    >
      <Stack spacing={0.4}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Stack>
    </Box>
  );
};

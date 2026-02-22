import {
  List,
  Datagrid,
  TextField,
  FunctionField,
  TextInput,
  TopToolbar,
  useListContext,
  useNotify,
} from "react-admin";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  alpha,
  useTheme,
} from "@mui/material";
import { Download, ChartColumnIncreasing } from "lucide-react";
import type { AttendanceMetric } from "../metricsTypes";
import { metricsGateway } from "../metricsGateway";
import { PageHeader } from "../../shared/components/PageHeader";
import { PageContainer } from "../../shared/components/PageContainer";
import {
  datagridBaseSx,
  datagridHoverSx,
  listMainTransparentSx,
} from "../../shared/styles/listStyles";

const filters = [<TextInput key="cenario" source="cenario" label="Cenário" alwaysOn />];

export const AuditMetricsList = () => (
  <PageContainer>
    <PageHeader
      title="Métricas de Atendimento"
      description="Indicadores por cenário e exportação para análise externa."
      icon={<ChartColumnIncreasing size={20} />}
    />

    <List
      title="Métricas"
      filters={filters}
      sort={{ field: "id", order: "DESC" }}
      perPage={25}
      actions={<MetricsActions />}
      sx={listMainTransparentSx}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: (theme) => alpha(theme.palette.divider, 0.8),
          overflow: "hidden",
        }}
      >
        <MetricsGridHeader />

        <Datagrid
          bulkActionButtons={false}
          rowClick={false}
          sx={{
            ...datagridBaseSx,
            ...datagridHoverSx,
            "& .RaDatagrid-root": { boxShadow: "none" },
            "& .column-cenario": {
              display: { xs: "none", md: "table-cell" },
            },
          }}
        >
          <TextField
            source="id"
            label="ID"
            sx={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.8rem" }}
          />
          <TextField source="cenario" label="Cenário" />
          <FunctionField
            label="Tipo"
            render={(record: AttendanceMetric) => toPtType(record.tipo)}
          />
          <FunctionField
            label="Estado"
            render={(record: AttendanceMetric) => toPtStatus(record.status)}
          />
          <FunctionField
            label="Biometria"
            render={(record: AttendanceMetric) =>
              record.biometria === null ? "N/D" : record.biometria ? "Sim" : "Não"
            }
          />
          <FunctionField
            label="Entrada"
            render={(record: AttendanceMetric) =>
              formatDateTime(record.t_entrada)
            }
          />
          <FunctionField
            label="Chamada"
            render={(record: AttendanceMetric) =>
              formatDateTime(record.t_chamada)
            }
          />
          <FunctionField
            label="Fim"
            render={(record: AttendanceMetric) => formatDateTime(record.t_fim)}
          />
          <FunctionField
            label="Espera"
            render={(record: AttendanceMetric) => formatDuration(record.espera_seg)}
          />
          <FunctionField
            label="Atendimento"
            render={(record: AttendanceMetric) =>
              formatDuration(record.atendimento_seg)
            }
          />
        </Datagrid>
      </Paper>
    </List>
  </PageContainer>
);

const MetricsActions = () => {
  const notify = useNotify();
  const { filterValues } = useListContext<AttendanceMetric>();
  const cenario =
    typeof filterValues?.cenario === "string" ? filterValues.cenario : undefined;

  const handleExport = async () => {
    try {
      await metricsGateway.exportCsv(cenario);
      notify("Exportação iniciada", { type: "info" });
    } catch {
      notify("Falha ao exportar CSV", { type: "warning" });
    }
  };

  return (
    <TopToolbar>
      <Button
        variant="outlined"
        onClick={handleExport}
        startIcon={<Download size={16} />}
      >
        Exportar CSV
      </Button>
    </TopToolbar>
  );
};

const MetricsGridHeader = () => {
  const theme = useTheme();
  const { total } = useListContext<AttendanceMetric>();

  return (
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
        <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
          Tabela de métricas de atendimento
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Base para análise de tempos e estado de atendimento
        </Typography>
      </Box>
      <Stack direction="row" spacing={1}>
        <Typography
          variant="caption"
          sx={{
            px: 1.2,
            py: 0.45,
            borderRadius: 1.25,
            border: "1px solid",
            borderColor: alpha(theme.palette.primary.main, 0.25),
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            fontWeight: 700,
            letterSpacing: "0.03em",
            color: "primary.dark",
          }}
        >
          {total ?? 0} REGISTO(S)
        </Typography>
      </Stack>
    </Box>
  );
};

const formatDateTime = (value: string | null) => {
  if (!value) return "N/D";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("pt-PT");
};

const formatDuration = (seconds: number | null) => {
  if (seconds === null || Number.isNaN(seconds)) return "N/D";
  const whole = Math.max(0, Math.round(seconds));
  const mins = Math.floor(whole / 60);
  const secs = whole % 60;
  return `${mins}m ${String(secs).padStart(2, "0")}s`;
};

const toPtType = (value: string | null) => {
  if (!value) return "N/D";
  const normalized = value.toLowerCase();
  if (normalized === "normal") return "Normal";
  if (normalized === "priority") return "Prioritário";
  if (normalized === "urgent") return "Urgente";
  return value;
};

const toPtStatus = (value: string | null) => {
  if (!value) return "N/D";
  const normalized = value.toLowerCase();
  if (normalized === "waiting") return "Em espera";
  if (normalized === "called_pending") return "Chamado (pendente)";
  if (normalized === "being_served") return "Em atendimento";
  if (normalized === "called") return "Chamado";
  if (normalized === "finished" || normalized === "done") return "Concluído";
  if (normalized === "cancelled" || normalized === "canceled") return "Cancelado";
  return value;
};

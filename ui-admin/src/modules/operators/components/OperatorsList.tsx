// src/modules/operators/components/OperatorsList.tsx
import {
  List,
  Datagrid,
  TextField,
  FunctionField,
  DateField,
  useListContext,
} from "react-admin";
import { Stack, Box, Paper, Typography, alpha, useTheme } from "@mui/material";
import { Users, Shield, Cpu } from "lucide-react";
import { RoleBadge } from "./RoleBadge";
import type { Operator } from "../types";
import { PageHeader } from "../../shared/components/PageHeader";
import { StatusChip } from "../../shared/components/StatusChip";
import { PageContainer } from "../../shared/components/PageContainer";
import {
  datagridBaseSx,
  datagridHoverSx,
  listMainTransparentSx,
} from "../../shared/styles/listStyles";

export const OperatorsList = () => (
  <PageContainer>
    <PageHeader
      title="Operadores"
      description="Acesso, função e estado operacional dos utilizadores internos."
      icon={<Users size={20} />}
    />

    <List
      title="Operadores"
      sort={{ field: "username", order: "ASC" }}
      perPage={25}
      sx={listMainTransparentSx}
    >
      <OperatorsOverview />

      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: (theme) => alpha(theme.palette.divider, 0.8),
          overflow: "hidden",
        }}
      >
        {/* Cabeçalho */}
        <Box
          sx={{
            px: 2.5,
            py: 1.75,
            borderBottom: "1px solid",
            borderColor: (theme) => alpha(theme.palette.divider, 0.6),
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.03),
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
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
              }}
            >
              <Users size={16} />
            </Box>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 800, lineHeight: 1.2 }}
              >
                Tabela de operadores
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Clique numa linha para editar
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Datagrid
          rowClick="edit"
          bulkActionButtons={false}
          sx={{
            ...datagridBaseSx,
            ...datagridHoverSx,
            "& .RaDatagrid-root": { boxShadow: "none" },
            "& .column-createdAt, & .column-lastLogin": {
              display: { xs: "none", lg: "table-cell" },
            },
          }}
        >
          <TextField
            source="id"
            label="Ref."
            sx={{ fontWeight: 700, color: "text.disabled", fontSize: "0.8rem" }}
          />
          <TextField
            source="username"
            label="Utilizador"
            sx={{ fontWeight: 700 }}
          />
          <RoleBadge source="role" />
          <FunctionField
            label="Estado"
            render={(record: Operator) => (
              <StatusChip
                label={record.active ? "ATIVO" : "INATIVO"}
                color={record.active ? "success" : "default"}
                variant={record.active ? "filled" : "outlined"}
              />
            )}
          />
          <DateField source="createdAt" label="Criado em" showTime />
          <DateField source="lastLogin" label="Último login" showTime />
        </Datagrid>
      </Paper>
    </List>
  </PageContainer>
);

const OperatorsOverview = () => {
  const { data = [], isPending } = useListContext<Operator>();
  const theme = useTheme();
  if (isPending) return null;

  const active = data.filter((o) => o.active).length;
  const inactive = data.length - active;
  const system = data.filter((o) => o.role === "system").length;

  const stats = [
    {
      icon: Shield,
      label: "Ativos",
      value: active,
      tone: theme.palette.success.main,
    },
    {
      icon: Users,
      label: "Inativos",
      value: inactive,
      tone: theme.palette.text.secondary,
    },
    {
      icon: Cpu,
      label: "Sistema",
      value: system,
      tone: theme.palette.error.main,
    },
  ];

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1.5}
      sx={{ mb: 1.5 }}
    >
      {stats.map(({ icon: Icon, label, value, tone }) => (
        <Paper
          key={label}
          elevation={0}
          sx={{
            flex: 1,
            p: 2,
            borderRadius: 2,
            border: "1px solid",
            borderColor: alpha(tone, 0.2),
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(tone, 0.07)} 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "4px",
              bgcolor: tone,
            },
          }}
        >
          <Stack spacing={0.25} sx={{ pl: 0.5 }}>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 800,
                letterSpacing: 1,
                color: "text.secondary",
                lineHeight: 1.4,
              }}
            >
              {label}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, color: tone }}>
              {value}
            </Typography>
          </Stack>

          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: alpha(tone, 0.1),
              color: tone,
            }}
          >
            <Icon size={20} />
          </Box>
        </Paper>
      ))}
    </Stack>
  );
};

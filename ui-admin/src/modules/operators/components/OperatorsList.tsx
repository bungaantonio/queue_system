// src/modules/operators/components/OperatorsList.tsx
import {
  List,
  Datagrid,
  TextField,
  FunctionField,
  DateField,
  useListContext,
} from "react-admin";
import { Stack, Card, Box, Paper, Typography, alpha, useTheme } from "@mui/material";
import { Users, Shield, Cpu } from "lucide-react";
import { RoleBadge } from "./RoleBadge";
import type { Operator } from "../types";
import { PageHeader } from "../../shared/components/PageHeader";
import { StatusChip } from "../../shared/components/StatusChip";
import { PageContainer } from "../../shared/components/PageContainer";
import {
  datagridBaseSx,
  datagridHoverSx,
  listCardSx,
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

      <Card sx={listCardSx}>
        <Box
          sx={{
            px: { xs: 2, md: 2.5 },
            pt: { xs: 2, md: 2.5 },
            pb: 1,
            borderBottom: "1px solid",
            borderColor: (theme) => alpha(theme.palette.divider, 0.8),
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              Tabela de operadores
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Ordenado por utilizador
            </Typography>
          </Box>
          <Box
            sx={{
              height: 6,
              width: 44,
              borderRadius: 1,
              bgcolor: "primary.main",
            }}
          />
        </Box>
        <Datagrid
          rowClick="edit"
          bulkActionButtons={false}
          sx={{
            ...datagridBaseSx,
            ...datagridHoverSx,
            "& .MuiTableHead-root": {
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(
                  theme.palette.background.default,
                  0.6,
                )} 100%)`,
            },
            "& .MuiTableCell-head": {
              py: 1.5,
            },
            "& .column-createdAt, & .column-lastLogin": {
              display: { xs: "none", lg: "table-cell" },
            },
          }}
        >
          <TextField
            source="id"
            label="ID"
            sx={{ fontWeight: 800, color: "text.disabled" }}
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
      </Card>
    </List>
  </PageContainer>
);

const OperatorsOverview = () => {
  const { data = [], isPending } = useListContext<Operator>();
  const theme = useTheme();
  if (isPending) return null;

  const active = data.filter((item) => item.active).length;
  const inactive = data.length - active;
  const system = data.filter((item) => item.role === "system").length;

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ mb: 1.5 }}>
      {[
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
      ].map((item) => {
        const Icon = item.icon;
        return (
          <Paper
            key={item.label}
            elevation={0}
            sx={{
              flex: 1,
              minWidth: { xs: "100%", md: 0 },
              p: 1.5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: alpha(item.tone, 0.2),
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(
                item.tone,
                0.08,
              )} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Stack spacing={0.3}>
              <Typography
                variant="overline"
                sx={{ fontWeight: 900, letterSpacing: 1.2 }}
              >
                {item.label}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900 }}>
                {item.value}
              </Typography>
            </Stack>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 1.5,
                display: "grid",
                placeItems: "center",
                bgcolor: alpha(item.tone, 0.12),
                color: item.tone,
              }}
            >
              <Icon size={18} />
            </Box>
          </Paper>
        );
      })}
    </Stack>
  );
};

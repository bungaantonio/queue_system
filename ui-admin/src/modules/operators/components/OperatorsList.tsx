// src/modules/operators/components/OperatorsList.tsx
import {
  List,
  Datagrid,
  TextField,
  FunctionField,
  DateField,
  Title,
  useListContext,
} from "react-admin";
import { Box, Typography, Stack, alpha, Chip, Card } from "@mui/material";
import { Users, Shield, Cpu } from "lucide-react";
import { RoleBadge } from "./RoleBadge";
import type { Operator } from "../types";

export const OperatorsList = () => (
  <Box>
    <Title title="Operadores" />

    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
      <Box
        sx={{
          p: 1.25,
          bgcolor: "primary.main",
          borderRadius: 2.5,
          color: "white",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Users size={20} />
      </Box>
      <Box>
        <Typography variant="h4">Operadores</Typography>
        <Typography variant="body2" color="text.secondary">
          Acesso, função e estado operacional dos utilizadores internos.
        </Typography>
      </Box>
    </Stack>

    <List
      sort={{ field: "username", order: "ASC" }}
      perPage={25}
      sx={{
        bgcolor: "transparent",
        "& .RaList-main": { boxShadow: "none", border: "none" },
      }}
    >
      <OperatorsOverview />

      <Card
        sx={{
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Datagrid
          rowClick="edit"
          bulkActionButtons={false}
          sx={{
            "& .MuiTableCell-head": {
              bgcolor: "background.default",
              py: 1.5,
            },
            "& .MuiTableRow-root:hover": {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.03),
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
              <Chip
                size="small"
                label={record.active ? "ATIVO" : "INATIVO"}
                color={record.active ? "success" : "default"}
                variant={record.active ? "filled" : "outlined"}
                sx={{
                  height: 22,
                  "& .MuiChip-label": {
                    px: 1,
                    fontSize: "0.62rem",
                    fontWeight: 900,
                    letterSpacing: "0.08em",
                  },
                }}
              />
            )}
          />
          <DateField source="createdAt" label="Criado em" showTime />
          <DateField source="lastLogin" label="Último login" showTime />
        </Datagrid>
      </Card>
    </List>
  </Box>
);

const OperatorsOverview = () => {
  const { data = [], isPending } = useListContext<Operator>();
  if (isPending) return null;

  const active = data.filter((item) => item.active).length;
  const inactive = data.length - active;
  const system = data.filter((item) => item.role === "system").length;

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ mb: 1.5 }}>
      <Chip
        icon={<Shield size={13} />}
        label={`${active} ativos`}
        color="success"
        sx={{ justifyContent: "flex-start" }}
      />
      <Chip
        icon={<Users size={13} />}
        label={`${inactive} inativos`}
        color="default"
        variant="outlined"
        sx={{ justifyContent: "flex-start" }}
      />
      <Chip
        icon={<Cpu size={13} />}
        label={`${system} conta(s) de sistema`}
        color="error"
        variant="outlined"
        sx={{ justifyContent: "flex-start" }}
      />
    </Stack>
  );
};

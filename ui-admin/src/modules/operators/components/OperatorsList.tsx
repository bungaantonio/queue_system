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
import { Box, Stack, Chip, Card } from "@mui/material";
import { Users, Shield, Cpu } from "lucide-react";
import { RoleBadge } from "./RoleBadge";
import type { Operator } from "../types";
import { PageHeader } from "../../shared/components/PageHeader";
import { StatusChip } from "../../shared/components/StatusChip";
import {
  datagridBaseSx,
  datagridHoverSx,
  listCardSx,
  listMainTransparentSx,
} from "../../shared/styles/listStyles";

export const OperatorsList = () => (
  <Box>
    <Title title="Operadores" />

    <PageHeader
      title="Operadores"
      description="Acesso, função e estado operacional dos utilizadores internos."
      icon={<Users size={20} />}
    />

    <List
      sort={{ field: "username", order: "ASC" }}
      perPage={25}
      sx={listMainTransparentSx}
    >
      <OperatorsOverview />

      <Card sx={listCardSx}>
        <Datagrid
          rowClick="edit"
          bulkActionButtons={false}
          sx={{
            ...datagridBaseSx,
            ...datagridHoverSx,
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

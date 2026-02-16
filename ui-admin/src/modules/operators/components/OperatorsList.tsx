// src/modules/operators/components/OperatorsList.tsx
import { List, Datagrid, TextField, BooleanField, Title } from "react-admin";
import { Box, Typography, Stack, alpha } from "@mui/material";
import { RoleBadge } from "./RoleBadge";
import { Users } from "lucide-react";

export const OperatorsList = () => (
  <Box>
    <Title title="Gestão de Operadores" />

    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
      <Box
        sx={{
          p: 1.25,
          bgcolor: "primary.main",
          borderRadius: 2.5,
          color: "white",
        }}
      >
        <Users size={20} />
      </Box>
      <Box>
        <Typography variant="h4">Operadores</Typography>
        <Typography variant="body2" color="text.secondary">
          Controle de acessos e funções administrativas do sistema
        </Typography>
      </Box>
    </Stack>

    <List
      sort={{ field: "username", order: "ASC" }}
      sx={{
        bgcolor: "transparent",
        "& .RaList-main": { boxShadow: "none", border: "none" },
      }}
    >
      <Datagrid
        rowClick="edit"
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          "& .MuiTableCell-head": {
            bgcolor: "background.default",
            py: 2,
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
        <BooleanField source="active" label="Ativo" />
      </Datagrid>
    </List>
  </Box>
);

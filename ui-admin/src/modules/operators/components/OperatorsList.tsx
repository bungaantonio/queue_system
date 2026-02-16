// src/modules/operators/components/OperatorsList.tsx
import { List, Datagrid, TextField, BooleanField, Title } from "react-admin";
import { Box, Typography, Stack, alpha } from "@mui/material";
import { RoleBadge } from "./RoleBadge";
import { Users } from "lucide-react";

export const OperatorsList = () => (
  <Box sx={{ p: 4 }}>
    <Title title="Gestão de Operadores" />

    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
      <Box
        sx={{
          p: 1.5,
          bgcolor: "primary.main",
          borderRadius: 3,
          color: "white",
        }}
      >
        <Users size={24} />
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
          borderRadius: 5,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          "& .MuiTableCell-head": {
            bgcolor: "background.default",
            py: 2,
          },
          "& .MuiTableRow-root:hover": {
            bgcolor: alpha("#4f46e5", 0.02),
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

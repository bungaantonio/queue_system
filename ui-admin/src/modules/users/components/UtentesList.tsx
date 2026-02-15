// src/modules/users/components/UtentesList.tsx
import { List, Datagrid, TextField, DateField, SearchInput } from "react-admin";
import { Box, Typography, Stack, alpha, Card } from "@mui/material";
import { UserSearch } from "lucide-react";

export const UtentesList = () => (
  <Box sx={{ p: 4 }}>
    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
      <Box
        sx={{
          p: 1.5,
          bgcolor: "secondary.main",
          borderRadius: 3,
          color: "white",
        }}
      >
        <UserSearch size={24} />
      </Box>
      <Box>
        <Typography variant="h4">Base de Utentes</Typography>
        <Typography variant="body2" color="text.secondary">
          Consulta e histórico de registos biométricos
        </Typography>
      </Box>
    </Stack>

    <List
      filters={[<SearchInput key="q-filter" source="q" alwaysOn />]}
      sx={{ "& .RaList-main": { boxShadow: "none", bgcolor: "transparent" } }}
    >
      <Card
        sx={{
          borderRadius: 6,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Datagrid
          rowClick="edit"
          sx={{
            "& .MuiTableCell-head": { bgcolor: "background.default" },
            "& .MuiTableRow-root:hover": { bgcolor: alpha("#4f46e5", 0.02) },
          }}
        >
          <TextField
            source="id"
            label="Ref."
            sx={{ fontWeight: 800, color: "text.disabled" }}
          />
          <TextField source="name" label="Utente" sx={{ fontWeight: 700 }} />
          <TextField source="document_id" label="NIF / BI" />
          <DateField source="birth_date" label="Nascimento" />
          <TextField source="phone" label="Contacto" />
        </Datagrid>
      </Card>
    </List>
  </Box>
);

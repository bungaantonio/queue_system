// src/modules/users/components/UtentesList.tsx
import { List, Datagrid, TextField, DateField, SearchInput } from "react-admin";
import { Box, Typography, Stack, alpha, Card } from "@mui/material";
import { UserSearch } from "lucide-react";

export const UtentesList = () => (
  <Box>
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
      <Box
        sx={{
          p: 1.25,
          bgcolor: "primary.main",
          borderRadius: 2.5,
          color: "white",
        }}
      >
        <UserSearch size={20} />
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
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Datagrid
          rowClick="edit"
          sx={{
            "& .MuiTableCell-head": { bgcolor: "background.default" },
            "& .MuiTableRow-root:hover": {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.03),
            },
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

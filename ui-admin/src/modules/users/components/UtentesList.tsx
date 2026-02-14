// src/modules/users/components/UtentesList.tsx
import {
  List,
  Datagrid,
  TextField,
  DateField,
  TextInput,
  SearchInput,
  TopToolbar,
  CreateButton,
  ExportButton,
} from "react-admin";
import { Box, Card, Typography, Stack, alpha } from "@mui/material";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";

const ListActions = () => (
  <TopToolbar>
    <CreateButton variant="contained" sx={{ borderRadius: 2 }} />
    <ExportButton />
  </TopToolbar>
);

const UtenteFilters = [
  <SearchInput source="q" alwaysOn sx={{ width: 300 }} />,
  <TextInput label="Documento" source="document_id" />,
];

export const UtentesList = () => (
  <Box p={{ xs: 1, md: 3 }}>
    <Stack direction="row" spacing={2} alignItems="center" mb={3}>
      <PersonSearchIcon sx={{ fontSize: 32, color: "primary.main" }} />
      <Box>
        <Typography variant="h4" fontWeight="900">
          Utentes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gestão e consulta de base de dados de utentes
        </Typography>
      </Box>
    </Stack>

    <List
      actions={<ListActions />}
      filters={UtenteFilters}
      sx={{
        backgroundColor: "transparent",
        "& .RaList-main": { boxShadow: "none" },
      }}
    >
      <Card sx={{ borderRadius: 4, overflow: "hidden" }}>
        <Datagrid
          rowClick="edit"
          bulkActionButtons={false}
          sx={{
            "& .MuiTableCell-head": {
              bgcolor: "grey.50",
              fontWeight: 800,
              textTransform: "uppercase",
              fontSize: "0.7rem",
            },
            "& .MuiTableRow-root:hover": {
              bgcolor: alpha("#0EA5E9", 0.04),
            },
          }}
        >
          <TextField source="id" label="ID" />
          <TextField
            source="name"
            label="Nome Completo"
            sx={{ fontWeight: 600 }}
          />
          <TextField source="document_id" label="Documento" />
          <DateField source="birth_date" label="Data Nasc." />
          <TextField source="phone" label="Contacto" />
        </Datagrid>
      </Card>
    </List>
  </Box>
);

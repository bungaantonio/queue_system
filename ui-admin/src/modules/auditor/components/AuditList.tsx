// src/modules/auditor/components/AuditList.tsx
import { Box, Stack } from "@mui/material";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  Filter,
  TextInput,
  SimpleList,
} from "react-admin";
import { AuditSummary } from "./AuditSummary";

// Filtros organizados horizontalmente com espaçamento
const AuditFilter = (props: any) => (
  <Filter {...props}>
    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
      <TextInput label="Usuário ID" source="user_id" alwaysOn />
      <TextInput label="Operador ID" source="operator_id" />
      <TextInput label="Ação" source="action" />
    </Stack>
  </Filter>
);

// Lista principal
export const AuditList = (props: any) => (
  <Box sx={{ p: 3 }}>
    <Box sx={{ mb: 3 }}>
      <AuditSummary />
    </Box>
    <List
      {...props}
      resource="audits"
      filters={<AuditFilter />}
      // Alterna entre Datagrid e SimpleList conforme tamanho da tela
      sx={{ width: "100%" }}
    >
      {/* Datagrid para desktop */}
      <Datagrid rowClick="show" sx={{ "& .MuiDataGrid-cell": { py: 1 } }}>
        <TextField source="id" label="ID" sx={{ minWidth: 60 }} />
        <TextField source="action" label="Ação" sx={{ fontWeight: 500 }} />
        <TextField source="operator_id" label="Operador" />
        <TextField source="user_id" label="Usuário" />
        <TextField source="queue_item_id" label="Fila" />
        <TextField
          source="previous_hash_matches"
          label="Hash anterior OK?"
          sx={{ color: "text.secondary" }}
        />
        <TextField
          source="valid"
          label="Registro válido?"
          sx={{ color: "success.main", fontWeight: 500 }}
        />
        <DateField source="timestamp" label="Data" showTime />
      </Datagrid>

      {/* SimpleList para mobile */}
      <SimpleList
        primaryText={(record) => record.action}
        secondaryText={(record) =>
          `Usuário: ${record.user_id} | Operador: ${record.operator_id}`
        }
        tertiaryText={(record) => new Date(record.timestamp).toLocaleString()}
      />
    </List>
  </Box>
);

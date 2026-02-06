// src/modules/auditor/components/AuditList.tsx
import { Box } from "@mui/material";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  Filter,
  TextInput,
} from "react-admin";
import { AuditSummary } from "./AuditSummary";

const AuditFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="Usuário ID" source="user_id" alwaysOn />
    <TextInput label="Operador ID" source="operator_id" />
    <TextInput label="Ação" source="action" />
  </Filter>
);

export const AuditList = (props: any) => (
  <Box>
    <AuditSummary />
    <List filters={<AuditFilter />} {...props} resource="audits">
      <Datagrid rowClick="show">
        <TextField source="id" label="ID" />
        <TextField source="action" label="Ação" />
        <TextField source="operator_id" label="Operador" />
        <TextField source="user_id" label="Usuário" />
        <TextField source="queue_item_id" label="Fila" />
        <TextField source="previous_hash_matches" label="Hash anterior OK?" />
        <TextField source="valid" label="Registro válido?" />
        <DateField source="timestamp" label="Data" showTime />
      </Datagrid>
    </List>
  </Box>
);

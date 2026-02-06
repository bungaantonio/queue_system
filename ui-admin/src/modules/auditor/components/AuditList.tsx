import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  Filter,
  TextInput,
} from "react-admin";

const AuditFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="Usuário ID" source="user_id" alwaysOn />
    <TextInput label="Ação" source="action" />
  </Filter>
);

export const AuditList = (props: any) => (
  <List filters={<AuditFilter />} {...props} resource="audits">
    <Datagrid rowClick="show">
      <TextField source="audit_id" label="ID" />
      <TextField source="action" label="Ação" />
      <TextField source="user_id" label="Usuário" />
      <TextField source="previous_hash_matches" label="Hash anterior OK?" />
      <TextField source="valid" label="Registro válido?" />
      <DateField source="timestamp" label="Data" />
    </Datagrid>
  </List>
);

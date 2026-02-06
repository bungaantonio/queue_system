// src/modules/auditor/components/AuditShow.tsx
import { Show, SimpleShowLayout, TextField, DateField } from "react-admin";

export const AuditShow = (props: any) => (
  <Show {...props} resource="audits">
    <SimpleShowLayout>
      <TextField source="audit_id" label="ID" />
      <TextField source="action" label="Ação" />
      <TextField source="operator_id" label="Operador" />
      <TextField source="user_id" label="Usuário" />
      <TextField source="queue_item_id" label="Fila" />
      <TextField source="recalculated_hash" label="Hash recalculado" />
      <TextField source="stored_hash" label="Hash armazenado" />
      <TextField source="previous_hash_matches" label="Hash anterior OK?" />
      <TextField source="valid" label="Registro válido?" />
      <DateField source="timestamp" label="Data" />
    </SimpleShowLayout>
  </Show>
);

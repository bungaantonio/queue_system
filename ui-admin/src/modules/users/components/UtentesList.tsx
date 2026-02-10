import { List, Datagrid, TextField, DateField } from "react-admin";

export const UtentesList = (props: any) => (
  <List {...props} title="Utentes">
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="name" label="Nome" />
      <TextField source="document_id" label="Documento" />
      <DateField source="birth_date" label="Data Nascimento" />
    </Datagrid>
  </List>
);

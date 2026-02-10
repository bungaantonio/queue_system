import { List, Datagrid, TextField, EmailField } from "react-admin";

export const OperatorsList = (props: any) => (
  <List {...props} title="Operadores">
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="name" label="Nome" />
      <EmailField source="email" label="Email" />
      <TextField source="role" label="Função" />
    </Datagrid>
  </List>
);

import { List, Datagrid, TextField, BooleanField, EditButton, DeleteButton, SearchInput } from "react-admin";

export const OperatorList = () => (
    <List title="Operadores" filters={[<SearchInput source="q" alwaysOn />]}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="username" />
            <TextField source="role" />
            <BooleanField source="active" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

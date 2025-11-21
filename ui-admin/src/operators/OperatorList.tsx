// src/operators/OperatorList.tsx
import { List, Datagrid, TextField, DeleteButton } from "react-admin";

export const OperatorList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="username" />
            <TextField source="role" />
            <DeleteButton />
        </Datagrid>
    </List>
);

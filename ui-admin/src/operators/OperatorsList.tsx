import { List, Datagrid, TextField, EditButton, DeleteButton } from "react-admin";

export const OperatorsList = ({ permissions }: any) => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="username" />
            <TextField source="role" />

            {permissions === "admin" && <EditButton />}
            {permissions === "admin" && <DeleteButton />}
        </Datagrid>
    </List>
);

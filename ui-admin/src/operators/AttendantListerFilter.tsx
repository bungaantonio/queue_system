import { List, Datagrid, TextField, BooleanField } from "react-admin";

export const AttendantList = () => (
    <List filter={{ role: "Attendant" }}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="username" />
            <TextField source="role" />
            <BooleanField source="active" />
        </Datagrid>
    </List>
);

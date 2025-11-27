import { List, Datagrid, TextField, EditButton, DeleteButton, FunctionField } from "react-admin";
import { Box } from "@mui/material";
import { User, Shield } from "lucide-react";

export const OperatorsList = ({ permissions, ...props }: any) => (
    <List {...props} perPage={10} sort={{ field: "username", order: "ASC" }}>
        <Datagrid>
            <TextField source="id" label="ID" />
            <FunctionField
                label="Username"
                render={(record: any) => (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <User size={16} />
                        {record.username}
                    </Box>
                )}
            />
            <FunctionField
                label="Role"
                render={(record: any) => (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Shield size={16} />
                        {record.role}
                    </Box>
                )}
            />
            {permissions === "admin" && <EditButton />}
            {permissions === "admin" && <DeleteButton />}
        </Datagrid>
    </List>
);

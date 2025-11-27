import { List, Datagrid, TextField, EditButton, DeleteButton, FunctionField, TextInput, Filter } from "react-admin";
import { Box, Tooltip, Typography, Chip, Stack, Button } from "@mui/material";
import { User, Shield, Edit, Trash2 } from "lucide-react";

const roleColors: Record<string, "error" | "primary" | "info"> = {
    admin: "error",
    attendant: "primary",
    auditor: "info",
};

const OperatorsFilter = () => (
    <Filter>
        <TextInput label="Buscar" source="q" alwaysOn />
    </Filter>
);

export const OperatorsList = ({ permissions, ...props }: any) => (
    <List {...props} filters={<OperatorsFilter />} perPage={10} sort={{ field: "username", order: "ASC" }}>
        <Datagrid
            rowClick={permissions === "admin" ? "edit" : undefined}
            sx={{
                "& .RaDatagrid-row": {
                    transition: "background 0.2s, transform 0.2s",
                    "&:hover": { backgroundColor: "action.hover", transform: "scale(1.01)" },
                },
            }}
        >
            <TextField source="id" label="ID" />

            <FunctionField
                label="Nome de Utilizador"
                render={(record: any) => (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Tooltip title="Utilizador">
                            <User size={18} style={{ color: "#3b82f6" }} />
                        </Tooltip>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {record.username}
                        </Typography>
                    </Box>
                )}
            />

            <FunctionField
                label="Função"
                render={(record: any) => (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Tooltip title="Função">
                            <Shield size={18} style={{ color: "#22c55e" }} />
                        </Tooltip>
                        <Chip label={record.role} size="small" color={roleColors[record.role]} sx={{ fontWeight: 600 }} />
                    </Box>
                )}
            />

            {permissions === "admin" && (
                <FunctionField
                    label="Ações"
                    render={(record: any) => (
                        <Stack direction="row" spacing={1}>
                            <Button variant="outlined" size="small" startIcon={<Edit size={16} />}>
                                Edit
                            </Button>
                            <Button variant="outlined" size="small" color="error" startIcon={<Trash2 size={16} />}>
                                Delete
                            </Button>
                        </Stack>
                    )}
                />
            )}
        </Datagrid>
    </List>
);

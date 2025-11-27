import { Create, SimpleForm, TextInput, SelectInput } from "react-admin";
import { Typography } from "@mui/material";

export const OperatorsCreate = () => (
    <Create>
        <SimpleForm sx={{ maxWidth: 400, margin: "0 auto", gap: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Novo Operador</Typography>
            <TextInput source="username" label="Nome de Utilizador" required fullWidth />
            <TextInput source="password" type="password" label="Password" required fullWidth />
            <SelectInput
                source="role"
                label="Função"
                fullWidth
                choices={[
                    { id: "admin", name: "Administrador" },
                    { id: "attendant", name: "Atendente" },
                    { id: "auditor", name: "Auditor" },
                ]}
            />
        </SimpleForm>
    </Create>
);

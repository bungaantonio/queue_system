import { Edit, SimpleForm, TextInput, SelectInput } from "react-admin";

export const OperatorsEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="username" label="Nome de Utilizador" disabled />
            <TextInput source="password" type="password" label="Password" />
            <SelectInput
                source="role"
                label="Função"
                choices={[
                    { id: "admin", name: "Administrador" },
                    { id: "attendant", name: "Atendente" },
                    { id: "auditor", name: "Auditor" },
                ]}
            />
        </SimpleForm>
    </Edit>
);

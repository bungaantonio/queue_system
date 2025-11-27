import { Create, SimpleForm, TextInput, SelectInput } from "react-admin";

// Create
export const OperatorsCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="username" label="Nome de Utilizador" required />
            <TextInput source="password" type="password" label="Password" required />
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
    </Create>
);



import { Create, SimpleForm, TextInput, SelectInput } from "react-admin";

export const OperatorsCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="username" required />
            <TextInput source="password" type="password" required />

            <SelectInput
                source="role"
                choices={[
                    { id: "admin", name: "Administrador" },
                    { id: "attendant", name: "Atendente" },
                    { id: "auditor", name: "Auditor" },
                ]}
            />
        </SimpleForm>
    </Create>
);

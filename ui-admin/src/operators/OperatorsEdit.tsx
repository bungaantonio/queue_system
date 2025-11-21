import { Edit, SimpleForm, TextInput, SelectInput } from "react-admin";

export const OperatorsEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="username" disabled />

            <SelectInput
                source="role"
                choices={[
                    { id: "admin", name: "Administrador" },
                    { id: "attendant", name: "Atendente" },
                    { id: "auditor", name: "Auditor" },
                ]}
            />

            <TextInput source="password" type="password" />
        </SimpleForm>
    </Edit>
);

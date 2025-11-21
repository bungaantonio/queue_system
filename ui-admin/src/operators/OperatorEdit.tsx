// src/operators/OperatorEdit.tsx
import { Edit, SimpleForm, TextInput, SelectInput } from "react-admin";

export const OperatorEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="username" />
            <TextInput source="password" type="password" placeholder="Deixe vazio para não alterar" />
            <SelectInput
                source="role"
                choices={[
                    { id: "admin", name: "Admin" },
                       { id: "attendant", name: "Attendant" },
                ]}
            />
        </SimpleForm>
    </Edit>
);

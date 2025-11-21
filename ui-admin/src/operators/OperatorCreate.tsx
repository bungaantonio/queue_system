// src/operators/OperatorCreate.tsx
import { Create, SimpleForm, TextInput, SelectInput } from "react-admin";

export const OperatorCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="username" />
            <TextInput source="password" type="password" />
            <SelectInput
                source="role"
                choices={[
                    { id: "admin", name: "Admin" },
                    { id: "attendant", name: "Attendant" },
                ]}
            />
        </SimpleForm>
    </Create>
);

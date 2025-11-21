import { Create, SimpleForm, TextInput, SelectInput, PasswordInput } from "react-admin";

export const OperatorCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="username" />
            <SelectInput
                source="role"
                choices={[
                    { id: "admin", name: "Admin" },
                    { id: "attendant", name: "Attendant" },
                ]}
            />
            <PasswordInput source="password" />
        </SimpleForm>
    </Create>
);

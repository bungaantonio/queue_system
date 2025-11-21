import { Edit, SimpleForm, TextInput, SelectInput, PasswordInput } from "react-admin";

export const OperatorEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="username" disabled />

            <SelectInput
                source="role"
                choices={[
                    { id: "admin", name: "Admin" },
                    { id: "attendant", name: "Attendant" },
                ]}
            />

            <PasswordInput source="password" />
        </SimpleForm>
    </Edit>
);

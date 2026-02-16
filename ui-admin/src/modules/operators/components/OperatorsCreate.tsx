import { Create, SimpleForm, TextInput, SelectInput } from "react-admin";

export const OperatorsCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="username" label="Username" />
      <TextInput source="password" label="Senha" type="password" />
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

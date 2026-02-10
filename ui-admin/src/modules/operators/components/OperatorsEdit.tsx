import { Edit, SimpleForm, TextInput, SelectInput } from "react-admin";

export const OperatorsEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" label="Nome" />
      <TextInput source="email" label="Email" />
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

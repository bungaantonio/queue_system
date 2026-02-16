import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  Toolbar,
  SaveButton,
  DeleteWithConfirmButton,
} from "react-admin";

const OperatorEditToolbar = () => (
  <Toolbar>
    <SaveButton />
    <DeleteWithConfirmButton
      label="Desativar operador"
      confirmTitle="Desativar operador"
      confirmContent="Esta ação desativa o operador (não remove do banco)."
    />
  </Toolbar>
);

export const OperatorsEdit = () => (
  <Edit>
    <SimpleForm toolbar={<OperatorEditToolbar />}>
      <TextInput source="username" label="Nome de utilizador" />
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

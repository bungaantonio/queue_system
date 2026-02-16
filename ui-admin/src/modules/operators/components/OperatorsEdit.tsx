import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  BooleanInput,
  Toolbar,
  SaveButton,
  DeleteWithConfirmButton,
  useRecordContext,
  useNotify,
  useRefresh,
} from "react-admin";
import { Button } from "@mui/material";
import { operatorsGateway } from "../operatorsGateway";

const OperatorEditToolbar = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const canDeactivate = Boolean(record?.active);
  const canActivate = record?.active === false;

  const handleActivate = async () => {
    if (!record?.id) return;
    if (!window.confirm("Deseja ativar este operador?")) return;
    try {
      await operatorsGateway.activate(Number(record.id));
      notify("Operador ativado com sucesso.", { type: "success" });
      refresh();
    } catch {
      notify("Falha ao ativar operador.", { type: "error" });
    }
  };

  return (
    <Toolbar>
      <SaveButton />
      {canActivate ? (
        <Button onClick={handleActivate} variant="outlined" color="success">
          Ativar operador
        </Button>
      ) : null}
      {canDeactivate ? (
        <DeleteWithConfirmButton
          label="Desativar operador"
          confirmTitle="Desativar operador"
          confirmContent="Esta ação desativa o operador (não remove do banco)."
        />
      ) : null}
    </Toolbar>
  );
};

export const OperatorsEdit = () => (
  <Edit mutationMode="pessimistic">
    <SimpleForm toolbar={<OperatorEditToolbar />}>
      <TextInput source="username" label="Nome de utilizador" />
      <BooleanInput source="active" label="Ativo" disabled />
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

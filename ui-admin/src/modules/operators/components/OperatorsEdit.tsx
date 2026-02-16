import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  Toolbar,
  SaveButton,
  DeleteWithConfirmButton,
  useRecordContext,
  useNotify,
  useRefresh,
  useGetRecordId,
} from "react-admin";
import { Button, Stack, Alert, Typography, Chip } from "@mui/material";
import { operatorsGateway } from "../operatorsGateway";

const roleChoices = [
  { id: "admin", name: "Administrador" },
  { id: "attendant", name: "Atendente" },
  { id: "auditor", name: "Auditor" },
  { id: "system", name: "Sistema", disabled: true },
];

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
    <Toolbar sx={{ flexWrap: "wrap", gap: 1 }}>
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

const EditHeader = () => {
  const record = useRecordContext();
  const id = useGetRecordId();

  return (
    <Stack spacing={1.25} sx={{ mb: 1.5 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        alignItems={{ xs: "flex-start", sm: "center" }}
      >
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          Operador #{id}
        </Typography>
        <Chip
          size="small"
          label={record?.active ? "ATIVO" : "INATIVO"}
          color={record?.active ? "success" : "default"}
          variant={record?.active ? "filled" : "outlined"}
        />
      </Stack>
      <Typography variant="body2" color="text.secondary">
        Atualize função e dados de acesso. A conta de sistema não deve ser
        alterada.
      </Typography>
      {record?.role === "system" ? (
        <Alert severity="warning">
          Conta técnica detectada: alterações de função foram bloqueadas.
        </Alert>
      ) : null}
    </Stack>
  );
};

export const OperatorsEdit = () => (
  <Edit mutationMode="pessimistic">
    <SimpleForm toolbar={<OperatorEditToolbar />}>
      <EditHeader />

      <TextInput source="id" label="ID" disabled />
      <TextInput source="username" label="Nome de utilizador" fullWidth />
      <SelectInput
        source="role"
        label="Função"
        choices={roleChoices}
        disableValue="disabled"
      />
      <TextInput source="createdAt" label="Criado em" disabled fullWidth />
      <TextInput source="lastLogin" label="Último login" disabled fullWidth />
      <TextInput
        source="lastActivity"
        label="Última atividade"
        disabled
        fullWidth
      />
    </SimpleForm>
  </Edit>
);

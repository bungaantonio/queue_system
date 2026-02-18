import type { ReactNode } from "react";
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
import {
  Button,
  Stack,
  Typography,
  Chip,
  Paper,
  Box,
  alpha,
  useTheme,
} from "@mui/material";
import { operatorsGateway } from "../operatorsGateway";
import { PageContainer } from "../../shared/components/PageContainer";

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
  const theme = useTheme();

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
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            borderRadius: 2,
            border: "1px solid",
            borderColor: alpha(theme.palette.warning.main, 0.4),
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.warning.main,
              0.16,
            )} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
            Conta técnica detectada
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Alterações de função foram bloqueadas para este operador.
          </Typography>
        </Paper>
      ) : null}
    </Stack>
  );
};

export const OperatorsEdit = () => (
  <Edit mutationMode="pessimistic">
    <PageContainer>
      <SimpleForm toolbar={<OperatorEditToolbar />} sx={{ p: 0 }}>
        <EditHeader />

        <FormSection
          title="Dados de acesso"
          description="Informações de login e perfil operacional."
        >
          <TextInput source="id" label="ID" disabled />
          <TextInput source="username" label="Nome de utilizador" fullWidth />
          <SelectInput
            source="role"
            label="Função"
            choices={roleChoices}
            disableValue="disabled"
          />
        </FormSection>

        <FormSection
          title="Metadados"
          description="Registros automáticos do operador."
        >
          <TextInput source="createdAt" label="Criado em" disabled fullWidth />
          <TextInput
            source="lastLogin"
            label="Último login"
            disabled
            fullWidth
          />
          <TextInput
            source="lastActivity"
            label="Última atividade"
            disabled
            fullWidth
          />
        </FormSection>
      </SimpleForm>
    </PageContainer>
  </Edit>
);

const FormSection = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 2.5 },
        mb: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: alpha(theme.palette.divider, 0.9),
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(
          theme.palette.background.default,
          0.6,
        )} 100%)`,
      }}
    >
      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {description}
        </Typography>
        <Box sx={{ width: 36, height: 3, bgcolor: "primary.main" }} />
      </Stack>
      <Stack spacing={2}>{children}</Stack>
    </Paper>
  );
};

import {
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  useRecordContext,
} from "react-admin";
import { Stack, Typography, Alert } from "@mui/material";
import { BiometricInput } from "./BiometricInput";
import { PageContainer } from "../../shared/components/PageContainer";

const EditHeader = () => {
  const record = useRecordContext();
  return (
    <Stack spacing={1.25} sx={{ mb: 1 }}>
      <Typography variant="h5" sx={{ fontWeight: 900 }}>
        Editar Utente
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Atualize identificação e dados de contacto do registo selecionado.
      </Typography>
      {record?.id_number && !record?.document_id ? (
        <Alert severity="info">
          Documento carregado via `id_number` do endpoint.
        </Alert>
      ) : null}
    </Stack>
  );
};

export const UtentesEdit = () => (
  <Edit mutationMode="pessimistic">
    <PageContainer>
      <SimpleForm>
        <EditHeader />

        <TextInput source="id" label="ID" disabled />
        <TextInput source="name" label="Nome completo" fullWidth />
        <TextInput source="document_id" label="Documento (ID)" fullWidth />
        <TextInput
          source="id_number"
          label="Documento (origem API)"
          disabled
          fullWidth
        />
        <TextInput source="phone" label="Telefone" fullWidth />
        <DateInput source="birth_date" label="Data de nascimento" />
        <BiometricInput source="credential_identifier" operatorId={42} />
      </SimpleForm>
    </PageContainer>
  </Edit>
);

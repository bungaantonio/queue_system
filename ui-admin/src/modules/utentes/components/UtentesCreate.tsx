import {
  Create,
  SimpleForm,
  TextInput,
  DateInput,
  BooleanInput,
  SelectInput,
  required,
  minLength,
  type SaveHandler,
} from "react-admin";
import { Alert, Box } from "@mui/material";
import { BiometricInput } from "./BiometricInput";
import { utentesGateway } from "../utentesGateway";
import type { UtenteCreatePayload } from "../utentes.types";
import { PageHeader } from "../../shared/components/PageHeader";

interface UtentesCreateFormValues {
  name: string;
  birth_date: string;
  document_id: string;
  phone: string;
  is_pregnant?: boolean;
  pregnant_until?: string | null;
  is_disabled_temp?: boolean;
  disabled_until?: string | null;
  credential_identifier: string;
  attendance_type: "normal" | "priority" | "urgent";
}

const attendanceChoices = [
  { id: "normal", name: "Normal (Geral)" },
  { id: "priority", name: "Prioritário" },
  { id: "urgent", name: "Urgente" },
];

export const UtentesCreate = () => {
  const handleSave = async (values: UtentesCreateFormValues) => {
    if (!values.credential_identifier) {
      throw new Error("Credencial biométrica não capturada.");
    }

    const payload: UtenteCreatePayload = {
      user: {
        name: values.name,
        birth_date: values.birth_date,
        document_id: values.document_id,
        phone: values.phone,
        is_pregnant: values.is_pregnant ?? false,
        pregnant_until: values.pregnant_until ?? null,
        is_disabled_temp: values.is_disabled_temp ?? false,
        disabled_until: values.disabled_until ?? null,
      },
      credential: { identifier: values.credential_identifier },
      attendance_type: values.attendance_type,
    };

    await utentesGateway.create(payload);
  };

  const onSubmit: SaveHandler<UtentesCreateFormValues> = async (
    values: Partial<UtentesCreateFormValues>,
  ) => {
    await handleSave(values as UtentesCreateFormValues);
  };

  return (
    <Create redirect="list">
      <SimpleForm
        defaultValues={{ attendance_type: "normal" }}
        onSubmit={onSubmit}
      >
        <PageHeader
          title="Novo Utente"
          description="Registe identificação, biometria e prioridade de atendimento."
          mb={1}
        />

        <Alert severity="info" sx={{ mb: 2 }}>
          A biometria é obrigatória para vincular o utente ao fluxo de fila.
        </Alert>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
            width: "100%",
          }}
        >
          <TextInput
            source="name"
            label="Nome completo"
            fullWidth
            validate={[required(), minLength(3)]}
          />
          <TextInput
            source="document_id"
            label="Número de identificação"
            fullWidth
            validate={[required(), minLength(5)]}
          />
          <TextInput
            source="phone"
            label="Contacto telefónico"
            fullWidth
            validate={[required(), minLength(7)]}
          />
          <DateInput
            source="birth_date"
            label="Data de nascimento"
            fullWidth
            validate={required()}
          />
        </Box>

        <BiometricInput source="credential_identifier" operatorId={42} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
            width: "100%",
          }}
        >
          <BooleanInput source="is_pregnant" label="Utente gestante" />
          <DateInput
            source="pregnant_until"
            label="Data prevista parto"
            fullWidth
          />
          <BooleanInput source="is_disabled_temp" label="Mobilidade reduzida" />
          <DateInput
            source="disabled_until"
            label="Validade do atestado"
            fullWidth
          />
        </Box>

        <SelectInput
          source="attendance_type"
          label="Tipo de atendimento"
          choices={attendanceChoices}
          fullWidth
          validate={required()}
        />
      </SimpleForm>
    </Create>
  );
};

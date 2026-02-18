import type { ReactNode } from "react";
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
import { Box, Paper, Stack, Typography, alpha, useTheme } from "@mui/material";
import { BiometricInput } from "./BiometricInput";
import { utentesGateway } from "../utentesGateway";
import type { UtenteCreatePayload } from "../utentes.types";
import { PageHeader } from "../../shared/components/PageHeader";
import { PageContainer } from "../../shared/components/PageContainer";

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
      <PageContainer>
        <SimpleForm
          defaultValues={{ attendance_type: "normal" }}
          onSubmit={onSubmit}
          sx={{ p: 0 }}
        >
          <PageHeader
            title="Novo Utente"
            description="Registe identificação, biometria e prioridade de atendimento."
            mb={1}
          />

          <InfoCallout>
            A biometria é obrigatória para vincular o utente ao fluxo de fila.
          </InfoCallout>

          <FormSection
            title="Dados do utente"
            description="Identificacao e contacto principal."
            tone="primary"
          >
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
                label="Numero de identificacao"
                fullWidth
                validate={[required(), minLength(5)]}
              />
              <TextInput
                source="phone"
                label="Contacto telefonico"
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
          </FormSection>

          <FormSection
            title="Biometria"
            description="Captura obrigatoria para autenticar o utente."
            tone="success"
          >
            <BiometricInput source="credential_identifier" operatorId={42} />
          </FormSection>

          <FormSection
            title="Prioridade e condicao"
            description="Informacoes para prioridade de atendimento."
            tone="secondary"
          >
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
              <BooleanInput
                source="is_disabled_temp"
                label="Mobilidade reduzida"
              />
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
          </FormSection>
        </SimpleForm>
      </PageContainer>
    </Create>
  );
};

const FormSection = ({
  title,
  description,
  children,
  tone,
}: {
  title: string;
  description: string;
  children: ReactNode;
  tone?: "primary" | "secondary" | "success";
}) => {
  const theme = useTheme();
  const toneColor =
    tone === "secondary"
      ? theme.palette.secondary.main
      : tone === "success"
        ? theme.palette.success.main
        : theme.palette.primary.main;
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 2.5 },
        mb: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: alpha(toneColor, 0.3),
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(
          toneColor,
          0.08,
        )} 100%)`,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "6px",
          bgcolor: toneColor,
        },
      }}
    >
      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {description}
        </Typography>
        <Box sx={{ width: 36, height: 3, bgcolor: toneColor }} />
      </Stack>
      <Stack spacing={2}>{children}</Stack>
    </Paper>
  );
};

const InfoCallout = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        mb: 2,
        p: 1.5,
        borderRadius: 2,
        border: "1px solid",
        borderColor: alpha(theme.palette.primary.main, 0.3),
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.18,
        )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
        position: "relative",
        overflow: "hidden",
        "&::after": {
          content: '""',
          position: "absolute",
          right: -20,
          top: -20,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: alpha(theme.palette.primary.main, 0.2),
        },
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
        Nota operacional
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {children}
      </Typography>
    </Paper>
  );
};

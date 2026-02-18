import type { ReactNode } from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  useRecordContext,
} from "react-admin";
import { Stack, Typography, Paper, Box, alpha, useTheme } from "@mui/material";
import { BiometricInput } from "./BiometricInput";
import { PageContainer } from "../../shared/components/PageContainer";

const EditHeader = () => {
  const record = useRecordContext();
  const theme = useTheme();
  return (
    <Stack spacing={1.25} sx={{ mb: 1 }}>
      <Typography variant="h5" sx={{ fontWeight: 900 }}>
        Editar Utente
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Atualize identificação e dados de contacto do registo selecionado.
      </Typography>
      {record?.id_number && !record?.document_id ? (
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            borderRadius: 2,
            border: "1px solid",
            borderColor: alpha(theme.palette.primary.main, 0.3),
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.12,
            )} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
            Documento importado
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Documento carregado via id_number do endpoint.
          </Typography>
        </Paper>
      ) : null}
    </Stack>
  );
};

export const UtentesEdit = () => (
  <Edit mutationMode="pessimistic">
    <PageContainer>
      <SimpleForm sx={{ p: 0 }}>
        <EditHeader />

        <FormSection
          title="Identificacao"
          description="Dados basicos para localizar o utente."
          tone="primary"
        >
          <TextInput source="id" label="ID" disabled />
          <TextInput source="name" label="Nome completo" fullWidth />
          <TextInput source="document_id" label="Documento (ID)" fullWidth />
          <TextInput
            source="id_number"
            label="Documento (origem API)"
            disabled
            fullWidth
          />
        </FormSection>

        <FormSection
          title="Contacto"
          description="Informacoes de contacto e nascimento."
          tone="secondary"
        >
          <TextInput source="phone" label="Telefone" fullWidth />
          <DateInput source="birth_date" label="Data de nascimento" />
        </FormSection>

        <FormSection
          title="Biometria"
          description="Vinculo de identidade biometrica."
          tone="success"
        >
          <BiometricInput source="credential_identifier" operatorId={42} />
        </FormSection>
      </SimpleForm>
    </PageContainer>
  </Edit>
);

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

// src/modules/utentes/components/UtentesEdit.tsx
import {
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  useRecordContext,
} from "react-admin";
import { Stack, Typography, Paper, Box, alpha, useTheme } from "@mui/material";
import { AlertCircle } from "lucide-react";
import { BiometricInput } from "./BiometricInput";
import { FormSection } from "../../shared/components/FormSection";
import { PageContainer } from "../../shared/components/PageContainer";

const EditHeader = () => {
  const record = useRecordContext();
  const theme = useTheme();
  const showImportNotice = record?.id_number && !record?.document_id;

  return (
    <Stack spacing={1.5} sx={{ mb: 0.5 }}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          Editar Utente
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          Atualize identificação e dados de contacto do registo selecionado.
        </Typography>
      </Box>

      {showImportNotice && (
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            borderRadius: 2,
            border: "1px solid",
            borderColor: alpha(theme.palette.primary.main, 0.3),
            bgcolor: alpha(theme.palette.primary.main, 0.06),
            display: "flex",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          <AlertCircle
            size={16}
            color={theme.palette.primary.main}
            style={{ marginTop: 2, flexShrink: 0 }}
          />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              Documento importado
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Campo <code>id_number</code> carregado via API — somente leitura.
            </Typography>
          </Box>
        </Paper>
      )}
    </Stack>
  );
};

export const UtentesEdit = () => (
  <Edit mutationMode="pessimistic">
    <PageContainer>
      <SimpleForm sx={{ p: 0 }}>
        <Stack spacing={2.5}>
          <EditHeader />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "minmax(0, 1fr) minmax(0, 1fr)",
              },
              gap: 2,
              alignItems: { xs: "start", lg: "stretch" },
              gridTemplateAreas: {
                xs: `"identificacao" "biometria" "contacto"`,
                lg: `"identificacao biometria" "identificacao contacto"`,
              },
              gridAutoRows: { lg: "minmax(0, 1fr)" },
              minWidth: 0,
            }}
          >
            <Box sx={{ gridArea: "identificacao", minWidth: 0 }}>
              <FormSection
                step={1}
                tone="primary"
                title="Identificação"
                description="Dados básicos para localizar o utente."
                sx={{ height: { lg: "100%" } }}
              >
                <TextInput source="id" label="ID" disabled fullWidth />
                <TextInput source="name" label="Nome completo" fullWidth />
                <TextInput
                  source="document_id"
                  label="Documento (ID)"
                  fullWidth
                />
                <TextInput
                  source="id_number"
                  label="Documento (origem API)"
                  disabled
                  fullWidth
                />
              </FormSection>
            </Box>

            <Box sx={{ gridArea: "biometria", minWidth: 0 }}>
              <FormSection
                step={2}
                tone="success"
                title="Biometria"
                description="Vínculo de identidade biométrica."
                sx={{ height: { lg: "100%" } }}
              >
                <BiometricInput source="credential_identifier" operatorId={42} />
              </FormSection>
            </Box>

            <Box sx={{ gridArea: "contacto", minWidth: 0 }}>
              <FormSection
                step={3}
                tone="secondary"
                title="Contacto"
                description="Informações de contacto e nascimento."
                sx={{ height: { lg: "100%" } }}
              >
                <TextInput source="phone" label="Telefone" fullWidth />
                <DateInput source="birth_date" label="Data de nascimento" />
              </FormSection>
            </Box>
          </Box>
        </Stack>
      </SimpleForm>
    </PageContainer>
  </Edit>
);

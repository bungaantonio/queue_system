// src/modules/utentes/components/UtentesCreate.tsx
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
import { Box } from "@mui/material";
import { BiometricInput } from "./BiometricInput";
import { FormSection } from "../../shared/components/FormSection";
import { utentesGateway } from "../utentesGateway";
import type { UtenteCreatePayload } from "../utentes.types";
import { PageHeader } from "../../shared/components/PageHeader";
import { PageContainer } from "../../shared/components/PageContainer";

interface FormValues {
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
  const onSubmit: SaveHandler<FormValues> = async (raw) => {
    const values = raw as FormValues;

    if (!values.credential_identifier)
      throw new Error("Credencial biométrica não capturada.");

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

  return (
    <Create redirect="list">
      <PageContainer>
        <SimpleForm
          defaultValues={{ attendance_type: "normal" }}
          onSubmit={onSubmit}
          sx={{ p: 0 }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <PageHeader
              title="Novo Utente"
              description="Preencha os blocos abaixo para registar o utente no sistema."
              mb={0}
            />

            {/* Grade principal: 2 colunas, 3 linhas (1 ocupa duas linhas) */}
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
                  xs: `"identificacao" "biometria" "tipo" "condicoes"`,
                  lg: `"identificacao biometria" "identificacao tipo" "condicoes condicoes"`,
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
                  description="Dados pessoais e contacto principal."
                  sx={{ height: { lg: "100%" } }}
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
                </FormSection>
              </Box>

              <Box sx={{ gridArea: "biometria", minWidth: 0 }}>
                <FormSection
                  step={2}
                  tone="success"
                  title="Biometria"
                  description="Captura obrigatória para autenticar o utente no sistema de fila."
                  sx={{ height: { lg: "100%" } }}
                >
                  <BiometricInput
                    source="credential_identifier"
                    operatorId={42}
                  />
                </FormSection>
              </Box>

              <Box sx={{ gridArea: "tipo", minWidth: 0 }}>
                <FormSection
                  step={3}
                  tone="secondary"
                  title="Tipo de atendimento"
                  description="Defina o tipo de atendimento do utente."
                  sx={{ height: { lg: "100%" } }}
                >
                  <SelectInput
                    source="attendance_type"
                    label="Tipo de atendimento"
                    choices={attendanceChoices}
                    fullWidth
                    validate={required()}
                  />
                </FormSection>
              </Box>

              <Box sx={{ gridArea: "condicoes", minWidth: 0 }}>
                <FormSection
                  step={4}
                  tone="secondary"
                  title="Condições especiais"
                  description="Registe condições temporárias do utente."
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                      gap: 2,
                      alignItems: "start",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <BooleanInput
                        source="is_pregnant"
                        label="Utente gestante"
                      />
                      <DateInput
                        source="pregnant_until"
                        label="Data prevista do parto"
                        fullWidth
                      />
                    </Box>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
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
                  </Box>
                </FormSection>
              </Box>
            </Box>
          </Box>
        </SimpleForm>
      </PageContainer>
    </Create>
  );
};

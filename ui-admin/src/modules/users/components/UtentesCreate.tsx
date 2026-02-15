// src/modules/users/components/UtentesCreate.tsx
import {
  Create,
  SimpleForm,
  TextInput,
  DateInput,
  BooleanInput,
  SelectInput,
  Title,
} from "react-admin";
import {
  Box,
  Typography,
  Grid,
  Card,
  Divider,
  Stack,
} from "@mui/material";
import { BiometricInput } from "./BiometricInput";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

export const UtentesCreate = () => (
  <Create
    mutationMode="pessimistic"
    redirect="list"
    transform={(data: any) => ({
      user: {
        name: data.name,
        birth_date: data.birth_date,
        is_pregnant: data.is_pregnant,
        pregnant_until: data.pregnant_until || null,
        is_disabled_temp: !!data.is_disabled_temp,
        disabled_until: data.disabled_until || null,
        document_id: data.document_id,
        phone: data.phone,
      },
      credential: { identifier: data.biometric_id },
      attendance_type: data.attendance_type || "normal",
    })}
  >
    <SimpleForm toolbar={undefined} sx={{ p: 0 }}>
      <Box p={{ xs: 1, md: 3 }} maxWidth="1000px">
        <Title title="Registar Novo Utente" />

        <Stack spacing={4}>
          {/* SECÇÃO 1: DADOS PESSOAIS */}
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <PersonIcon color="primary" />
              <Typography variant="h6">Informação do Utente</Typography>
            </Stack>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 8 }}>
                <TextInput
                  source="name"
                  label="Nome Completo"
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextInput
                  source="document_id"
                  label="Documento (ID/BI)"
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextInput source="phone" label="Telemóvel" fullWidth />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <DateInput
                  source="birth_date"
                  label="Data de Nascimento"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* SECÇÃO 2: BIOMETRIA */}
          <BiometricInput source="biometric_id" operatorId={42} />

          <Divider />

          {/* SECÇÃO 3: PRIORIDADES E SAÚDE */}
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <MedicalServicesIcon color="secondary" />
              <Typography variant="h6">Prioridade e Saúde</Typography>
            </Stack>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 2, bgcolor: "grey.50" }} elevation={0}>
                  <BooleanInput source="is_pregnant" label="Gestante?" />
                  <DateInput
                    source="pregnant_until"
                    label="Previsão Parto"
                    fullWidth
                  />
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 2, bgcolor: "grey.50" }} elevation={0}>
                  <BooleanInput
                    source="is_disabled_temp"
                    label="Deficiência Temporária?"
                  />
                  <DateInput
                    source="disabled_until"
                    label="Válido até"
                    fullWidth
                  />
                </Card>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <SelectInput
                  source="attendance_type"
                  label="Tipo de Triagem Inicial"
                  fullWidth
                  choices={[
                    { id: "normal", name: "Atendimento Normal" },
                    { id: "urgent", name: "Atendimento Prioritário" },
                  ]}
                />
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Box>
    </SimpleForm>
  </Create>
);

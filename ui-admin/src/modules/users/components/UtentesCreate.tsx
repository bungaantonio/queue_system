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
import { Box, Typography, Grid, Card, Stack, alpha } from "@mui/material";
import { User, Activity, HeartPulse, type LucideIcon } from "lucide-react";
import { BiometricCapture } from "./BiometricCapture";

interface FormSectionHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

const FormSectionHeader = ({
  icon: Icon,
  title,
  subtitle,
}: FormSectionHeaderProps) => (
  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
    <Box
      sx={{
        p: 1,
        bgcolor: alpha("#4f46e5", 0.1),
        color: "primary.main",
        borderRadius: 2,
      }}
    >
      <Icon size={20} />
    </Box>
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
        {title}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {subtitle}
      </Typography>
    </Box>
  </Stack>
);

export const UtentesCreate = () => (
  <Create
    mutationMode="pessimistic"
    redirect="list"
    sx={{ "& .RaCreate-main": { boxShadow: "none" } }}
  >
    <SimpleForm sx={{ p: 0 }}>
      <Box sx={{ maxWidth: 1000, p: 4 }}>
        <Title title="Admissão de Utente" />

        <Grid container spacing={4}>
          {/* Coluna Principal: Identidade */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <Card sx={{ p: 4, mb: 4 }}>
              <FormSectionHeader
                icon={User}
                title="Identificação Civil"
                subtitle="Dados base do documento de identidade"
              />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextInput source="name" label="Nome Completo" fullWidth />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextInput
                    source="document_id"
                    label="Nº Documento"
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextInput
                    source="phone"
                    label="Contacto Telefónico"
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <DateInput
                    source="birth_date"
                    label="Data de Nascimento"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Card>

            <BiometricCapture source="credential" operatorId={42} />
          </Grid>

          {/* Coluna Lateral: Triagem e Prioridade */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Stack spacing={4}>
              <Card
                sx={{
                  p: 4,
                  borderLeft: "4px solid",
                  borderColor: "secondary.main",
                }}
              >
                <FormSectionHeader
                  icon={HeartPulse}
                  title="Triagem de Saúde"
                  subtitle="Condições especiais de atendimento"
                />
                <Stack spacing={2}>
                  <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 3 }}>
                    <BooleanInput
                      source="is_pregnant"
                      label="Utente Gestante"
                    />
                    <DateInput
                      source="pregnant_until"
                      label="Data prevista parto"
                      fullWidth
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 3 }}>
                    <BooleanInput
                      source="is_disabled_temp"
                      label="Mobilidade Reduzida"
                    />
                    <DateInput
                      source="disabled_until"
                      label="Validade do atestado"
                      fullWidth
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Stack>
              </Card>

              <Card sx={{ p: 4, bgcolor: "primary.main", color: "white" }}>
                <FormSectionHeader
                  icon={Activity}
                  title="Nível de Acesso"
                  subtitle="Definição da fila de espera"
                />
                <SelectInput
                  source="attendance_type"
                  label="Tipo de Atendimento"
                  fullWidth
                  choices={[
                    { id: "normal", name: "Normal (Geral)" },
                    { id: "urgent", name: "Prioritário (Saúde/Idade)" },
                  ]}
                  sx={{
                    "& .MuiFilledInput-root": { bgcolor: "white" },
                    "& .MuiInputLabel-root": { color: "primary.main" },
                  }}
                />
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </SimpleForm>
  </Create>
);

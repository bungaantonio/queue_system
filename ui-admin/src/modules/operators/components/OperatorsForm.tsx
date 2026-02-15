// src/modules/operators/components/OperatorsForm.tsx (Abstração para Create/Edit)
import {
  SimpleForm,
  TextInput,
  SelectInput,
  required,
  email,
  Create,
  Edit,
} from "react-admin";
import { Grid, Typography, Box, Divider, Stack } from "@mui/material";
import { User, Shield } from "lucide-react";

const FormSection = ({ title, icon: Icon, children }: any) => (
  <Box sx={{ mb: 4 }}>
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
      <Icon size={18} color="#4f46e5" />
      <Typography variant="subtitle2">{title}</Typography>
    </Stack>
    <Grid container spacing={3}>
      {children}
    </Grid>
  </Box>
);

export const OperatorsCreate = () => (
  <Box sx={{ p: 4, maxWidth: 900 }}>
    <Typography variant="h4" sx={{ mb: 4 }}>
      Novo Operador
    </Typography>
    <Create redirect="list">
      <SimpleForm sx={{ p: 0 }}>
        <FormSection title="Identificação" icon={User}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextInput
              source="username"
              label="Nome de Utilizador"
              fullWidth
              validate={required()}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextInput
              source="email"
              label="Email Corporativo"
              fullWidth
              validate={[required(), email()]}
            />
          </Grid>
        </FormSection>

        <Divider sx={{ my: 4 }} />

        <FormSection title="Segurança e Acesso" icon={Shield}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextInput
              source="password"
              label="Senha"
              type="password"
              fullWidth
              validate={required()}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SelectInput
              source="role"
              label="Função no Sistema"
              fullWidth
              validate={required()}
              choices={[
                { id: "admin", name: "Administrador" },
                { id: "attendant", name: "Atendente" },
                { id: "auditor", name: "Auditor" },
              ]}
            />
          </Grid>
        </FormSection>
      </SimpleForm>
    </Create>
  </Box>
);

export const OperatorsEdit = () => (
  <Box sx={{ p: 4, maxWidth: 900 }}>
    <Typography variant="h4" sx={{ mb: 4 }}>
      Editar Operador
    </Typography>
    <Edit mutationMode="pessimistic">
      <SimpleForm sx={{ p: 0 }}>
        <FormSection title="Informação Pessoal" icon={User}>
          <Grid size={{ xs: 12 }}>
            <TextInput
              source="name"
              label="Nome Completo"
              fullWidth
              validate={required()}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextInput
              source="email"
              label="Email"
              fullWidth
              validate={[required(), email()]}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SelectInput
              source="role"
              label="Função"
              fullWidth
              choices={[
                { id: "admin", name: "Administrador" },
                { id: "attendant", name: "Atendente" },
                { id: "auditor", name: "Auditor" },
              ]}
            />
          </Grid>
        </FormSection>
      </SimpleForm>
    </Edit>
  </Box>
);

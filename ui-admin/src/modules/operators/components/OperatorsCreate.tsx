import type { ReactNode } from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  required,
  minLength,
} from "react-admin";
import { Box, Paper, Stack, Typography, alpha, useTheme } from "@mui/material";
import { PageHeader } from "../../shared/components/PageHeader";
import { PageContainer } from "../../shared/components/PageContainer";

const roleChoices = [
  { id: "admin", name: "Administrador" },
  { id: "attendant", name: "Atendente" },
  { id: "auditor", name: "Auditor" },
  { id: "system", name: "Sistema", disabled: true },
];

export const OperatorsCreate = () => (
  <Create redirect="list">
    <PageContainer>
      <SimpleForm defaultValues={{ role: "attendant" }} sx={{ p: 0 }}>
        <PageHeader
          title="Novo Operador"
          description="Crie acesso apenas para perfis humanos. Conta de sistema é reservada."
          mb={1}
        />

        <InfoCallout>
          Após criar o operador, valide o papel correto antes do primeiro login.
        </InfoCallout>

        <FormSection
          title="Dados do operador"
          description="Credenciais de acesso e função operacional."
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <TextInput
              source="username"
              label="Nome de utilizador"
              fullWidth
              validate={[required(), minLength(3)]}
            />
            <SelectInput
              source="role"
              label="Função"
              fullWidth
              choices={roleChoices}
              disableValue="disabled"
              validate={required()}
            />
          </Box>
        </FormSection>

        <FormSection
          title="Credenciais"
          description="Senha temporária de acesso."
        >
          <TextInput
            source="password"
            label="Senha temporária"
            type="password"
            fullWidth
            validate={[required(), minLength(6)]}
          />
        </FormSection>
      </SimpleForm>
    </PageContainer>
  </Create>
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
          0.12,
        )} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
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

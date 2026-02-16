import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  required,
  minLength,
} from "react-admin";
import { Box, Typography, Stack, Alert } from "@mui/material";

const roleChoices = [
  { id: "admin", name: "Administrador" },
  { id: "attendant", name: "Atendente" },
  { id: "auditor", name: "Auditor" },
  { id: "system", name: "Sistema", disabled: true },
];

export const OperatorsCreate = () => (
  <Create redirect="list">
    <SimpleForm defaultValues={{ role: "attendant" }}>
      <Stack spacing={1.25} sx={{ mb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          Novo Operador
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Crie acesso apenas para perfis humanos. Conta de sistema é reservada.
        </Typography>
      </Stack>

      <Alert severity="info" sx={{ mb: 2 }}>
        Após criar o operador, valide o papel correto antes do primeiro login.
      </Alert>

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

      <TextInput
        source="password"
        label="Senha temporária"
        type="password"
        fullWidth
        validate={[required(), minLength(6)]}
      />
    </SimpleForm>
  </Create>
);

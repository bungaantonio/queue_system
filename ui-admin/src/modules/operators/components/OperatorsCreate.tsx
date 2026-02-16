import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  required,
  minLength,
} from "react-admin";
import { Box, Alert } from "@mui/material";
import { PageHeader } from "../../shared/components/PageHeader";

const roleChoices = [
  { id: "admin", name: "Administrador" },
  { id: "attendant", name: "Atendente" },
  { id: "auditor", name: "Auditor" },
  { id: "system", name: "Sistema", disabled: true },
];

export const OperatorsCreate = () => (
  <Create redirect="list">
    <SimpleForm defaultValues={{ role: "attendant" }}>
      <PageHeader
        title="Novo Operador"
        description="Crie acesso apenas para perfis humanos. Conta de sistema é reservada."
        mb={1}
      />

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

import { Create, SimpleForm, TextInput, SelectInput } from "react-admin";
import { Typography, Paper, Grid } from "@mui/material";

export const OperatorsCreate = () => (
  <Create>
    <SimpleForm sx={{ maxWidth: 600, margin: "0 auto", gap: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Novo Operador
      </Typography>

      <Paper sx={{ p: 2 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 12 }}>
            <TextInput
              source="username"
              label="Nome de Utilizador"
              required
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, md: 12 }}>
            <TextInput
              source="password"
              type="password"
              label="Password"
              required
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, md: 12 }}>
            <SelectInput
              source="role"
              label="Função"
              fullWidth
              choices={[
                { id: "admin", name: "Administrador" },
                { id: "attendant", name: "Atendente" },
              ]}
            />
          </Grid>
        </Grid>
      </Paper>
    </SimpleForm>
  </Create>
);

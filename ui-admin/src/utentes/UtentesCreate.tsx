// src/utentes/UtentesCreate.tsx
import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  DateInput,
  BooleanInput,
  SelectInput,
} from "react-admin";
import { Typography, Paper, Grid } from "@mui/material";

export const UtentesCreate = () => (
  <Create>
    <SimpleForm sx={{ maxWidth: 900, margin: "0 auto", gap: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Cadastro de Utente
      </Typography>

      {/* Dados Pessoais */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Dados Pessoais
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextInput source="name" label="Nome" required fullWidth />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <DateInput
              source="birth_date"
              label="Data Nascimento"
              required
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextInput
              source="document_id"
              label="Documento"
              required
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextInput source="phone" label="Telefone" required fullWidth />
          </Grid>
        </Grid>
      </Paper>

      {/* Saúde e Status */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Saúde e Status
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <BooleanInput
              source="is_pregnant"
              label="Está grávida?"
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <DateInput source="pregnant_until" label="Até quando" fullWidth />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <BooleanInput
              source="is_disabled_temp"
              label="Deficiência temporária?"
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <DateInput source="disabled_until" label="Até quando" fullWidth />
          </Grid>
        </Grid>
      </Paper>

      {/* Atendimento */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Atendimento
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <SelectInput
              source="attendance_type"
              label="Tipo de Atendimento"
              fullWidth
              choices={[
                { id: "normal", name: "Normal" },
                { id: "urgent", name: "Urgente" },
              ]}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextInput
              source="operator_id"
              label="ID do Operador"
              required
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextInput
              source="finger_index"
              label="Índice do Dedo"
              required
              fullWidth
            />
          </Grid>
        </Grid>
      </Paper>
    </SimpleForm>
  </Create>
);

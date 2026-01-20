// src/utentes/UtentesCreateBlock.tsx
import React from "react";
import { TextInput, DateInput } from "react-admin";
import { Typography, Paper, Grid } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

export const DadosPessoaisBlock = () => (
  <Paper
    sx={{
      p: 3,
      mb: 3,
      borderRadius: 2,
      backgroundColor: "#f0f4ff", // fundo leve azul
      boxShadow: 3,
    }}
  >
    <Typography
      variant="subtitle1"
      sx={{ mb: 2, display: "flex", alignItems: "center" }}
    >
      <PersonIcon sx={{ mr: 1, color: "#1976d2" }} /> Dados Pessoais
    </Typography>

    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextInput source="name" label="Nome completo" required fullWidth />
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
        <TextInput source="document_id" label="Documento" required fullWidth />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextInput source="phone" label="Telefone" required fullWidth />
      </Grid>
    </Grid>
  </Paper>
);

// src/utentes/UtentesHealthBlock.tsx
import React from "react";
import { BooleanInput, SelectInput } from "react-admin";
import { Typography, Paper, Grid, Chip, Stack } from "@mui/material";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";

export const SaudeStatusBlock = () => (
  <Paper
    sx={{
      p: 3,
      mb: 3,
      borderRadius: 2,
      backgroundColor: "#fff7e6", // fundo leve laranja/amarelo
      boxShadow: 3,
    }}
  >
    <Typography
      variant="subtitle1"
      sx={{ mb: 2, display: "flex", alignItems: "center" }}
    >
      <HealthAndSafetyIcon sx={{ mr: 1, color: "#ff9800" }} /> Saúde e Status
    </Typography>

    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Stack direction="row" spacing={1}>
          <Chip label="Grávida?" color="primary" variant="outlined" />
          <BooleanInput source="is_pregnant" label="" sx={{ width: 50 }} />
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Stack direction="row" spacing={1}>
          <Chip
            label="Deficiência Temporária?"
            color="secondary"
            variant="outlined"
          />
          <BooleanInput source="is_disabled_temp" label="" sx={{ width: 50 }} />
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <SelectInput
          source="attendance_type"
          label="Tipo Atendimento"
          fullWidth
          choices={[
            { id: "urgent", name: "Urgente" },
            { id: "normal", name: "Normal" },
            { id: "priority", name: "Prioritário" },
          ]}
        />
      </Grid>
    </Grid>
  </Paper>
);

import React from "react";
import {
  TextInput,
  DateInput,
  BooleanInput,
  SelectInput,
  useNotify,
} from "react-admin";
import { useWatch, useFormContext } from "react-hook-form";
import { Typography, Paper, Grid, Button, Box, Divider } from "@mui/material";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";

const BiometricCaptureButton = () => {
  const { setValue } = useFormContext();
  const notify = useNotify();

  const handleCapture = async () => {
    try {
      const response = await fetch("http://localhost:5000/capture");
      const data = await response.json();
      setValue("biometric_id", data.hash, { shouldDirty: true });
      notify("Digital capturada!", { type: "success" });
    } catch (error) {
      // Modo Simulação para não travar a UI
      const mockHash = "SIM_" + Math.random().toString(36).substr(2, 9);
      setValue("biometric_id", mockHash, { shouldDirty: true });
      notify("Aviso: Usando ID simulado (Sensor offline).", {
        type: "warning",
      });
    }
  };

  return (
    <Button
      variant="outlined" // Outlined fica mais elegante que Contained para ações secundárias
      color="primary"
      fullWidth
      startIcon={<FingerprintIcon />}
      onClick={handleCapture}
      sx={{
        height: "56px",
        borderRadius: "8px",
        borderWidth: "2px",
        "&:hover": { borderWidth: "2px" },
      }}
    >
      Capturar Digital
    </Button>
  );
};

export const UtenteForm = () => {
  const isPregnant = useWatch({ name: "is_pregnant" });
  const isDisabled = useWatch({ name: "is_disabled_temp" });

  const sectionHeader = (
    icon: React.ReactNode,
    title: string,
    color: string,
  ) => (
    <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
      <Box sx={{ color: color, display: "flex" }}>{icon}</Box>
      <Typography variant="subtitle1" fontWeight={700} color="text.primary">
        {title}
      </Typography>
    </Box>
  );

  const paperStyle = {
    p: 3,
    borderRadius: "12px",
    border: "1px solid",
    borderColor: "divider",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    bgcolor: "background.paper",
  };

  return (
    <Grid container spacing={3} sx={{ mt: 1 }}>
      {/* Dados Pessoais */}
      <Grid size={{ xs: 12 }}>
        <Paper sx={paperStyle}>
          {sectionHeader(<PersonOutlineIcon />, "Dados Pessoais", "#1976d2")}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextInput
                source="name"
                label="Nome Completo"
                fullWidth
                required
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <DateInput
                source="birth_date"
                label="Data de Nascimento"
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextInput
                source="document_id"
                label="Documento (BI/NIF)"
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextInput source="phone" label="Telefone" fullWidth />
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Saúde e Prioridades */}
      <Grid size={{ xs: 12 }}>
        <Paper sx={paperStyle}>
          {sectionHeader(
            <HealthAndSafetyIcon />,
            "Prioridades de Saúde",
            "#ed6c02",
          )}
          <Grid container spacing={2} alignItems="flex-start">
            <Grid size={{ xs: 12, md: 3 }}>
              <BooleanInput
                source="is_pregnant"
                label="Gestante?"
                sx={{ mt: 1 }}
              />
              {isPregnant && (
                <DateInput
                  source="pregnant_until"
                  label="Previsão de Parto"
                  fullWidth
                  sx={{ mt: 1 }}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 1 }}>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ display: { xs: "none", md: "block" }, mx: "auto" }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <BooleanInput
                source="is_disabled_temp"
                label="Deficiência?"
                sx={{ mt: 1 }}
              />
              {isDisabled && (
                <DateInput
                  source="disabled_until"
                  label="Válido até"
                  fullWidth
                  sx={{ mt: 1 }}
                />
              )}
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Configuração de Atendimento */}
      <Grid size={{ xs: 12 }}>
        <Paper sx={{ ...paperStyle, borderLeft: "6px solid #1976d2" }}>
          {sectionHeader(
            <SettingsInputComponentIcon />,
            "Configuração de Atendimento",
            "#1976d2",
          )}
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <SelectInput
                source="attendance_type"
                label="Tipo de Fila"
                fullWidth
                choices={[
                  { id: "normal", name: "Normal" },
                  { id: "priority", name: "Prioritário" },
                  { id: "urgent", name: "Urgente" },
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextInput
                source="biometric_id"
                label="Hash da Digital"
                fullWidth
                disabled
                sx={{ bgcolor: "#f5f5f5", borderRadius: "4px" }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <BiometricCaptureButton />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

// src/modules/dashboard/DashboardPage.tsx
import { Box, Typography, Grid, Stack, alpha, Paper } from "@mui/material";
import { Title } from "react-admin";
import {
  Users,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Activity,
  Monitor,
} from "lucide-react";
import { StatCard } from "./components/StatCard";

export const DashboardPage = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Title title="Painel de Controlo" />

      {/* Header de Boas-vindas Técnico */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            Olá, Administrador
          </Typography>
          <Typography variant="body2" color="text.secondary">
            O sistema está a operar normalmente.{" "}
            <span style={{ color: "#10b981", fontWeight: 700 }}>● Live</span>
          </Typography>
        </Box>
        <Box
          sx={{
            px: 2,
            py: 1,
            bgcolor: "white",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontWeight: 800, color: "primary.main" }}
          >
            FEVEREIRO 15, 2026
          </Typography>
        </Box>
      </Stack>

      {/* Linha 1: KPIs Principais */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Hoje"
            value="142"
            icon={Users}
            color="#4f46e5"
            trend="+12%"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Em Espera" value="08" icon={Clock} color="#f59e0b" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Atendidos"
            value="134"
            icon={CheckCircle2}
            color="#10b981"
            trend="94%"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Tempo Médio"
            value="14min"
            icon={Activity}
            color="#0ea5e9"
          />
        </Grid>
      </Grid>

      {/* Linha 2: Monitorização em Tempo Real */}
      <Grid container spacing={3}>
        {/* Lado Esquerdo: Estado dos Balcões */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 4, height: "100%" }}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mb: 4 }}
            >
              <Monitor size={20} color="#4f46e5" />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Status dos Balcões
              </Typography>
            </Stack>

            <Grid container spacing={2}>
              {[1, 2, 3, 4].map((i) => (
                <Grid size={{ xs: 12, sm: 6 }} key={i}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      border: "1px solid",
                      borderColor: "divider",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      bgcolor: i === 1 ? alpha("#10b981", 0.02) : "transparent",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 800, color: "text.disabled" }}
                      >
                        BALCÃO 0{i}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        {i === 1 ? "Em Atendimento" : "Indisponível"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "full",
                        bgcolor: i === 1 ? "success.main" : "grey.300",
                        boxShadow:
                          i === 1
                            ? `0 0 10px ${alpha("#10b981", 0.5)}`
                            : "none",
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Lado Direito: Integridade (Visão Auditor) */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            sx={{
              p: 4,
              height: "100%",
              background: `linear-gradient(135deg, ${alpha("#4f46e5", 0.95)} 0%, #3730a3 100%)`,
              color: "white",
            }}
          >
            <Stack spacing={3}>
              <Stack direction="row" spacing={2} alignItems="center">
                <ShieldCheck size={24} />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Segurança de Dados
                </Typography>
              </Stack>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.8, display: "block", mb: 1 }}
                >
                  CADEIA DE AUDITORIA
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  Hash de Integridade Verificado
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.6, fontFamily: "monospace" }}
                >
                  v7.3.7-stable-2026-02-15
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Todos os logs de atendimento estão assinados e verificados
                criptograficamente.
              </Typography>

              <Box sx={{ flex: 1 }} />

              <Typography
                variant="h2"
                sx={{ fontWeight: 900, textAlign: "right", opacity: 0.2 }}
              >
                100%
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

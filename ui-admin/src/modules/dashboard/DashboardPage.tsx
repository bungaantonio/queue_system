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
  const nowLabel = new Intl.DateTimeFormat("pt-PT", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(new Date());

  return (
    <Box>
      <Title title="Painel de Controlo" />

      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        sx={{ mb: 2.5, gap: 1.25 }}
      >
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            Olá, Administrador
          </Typography>
          <Typography variant="body2" color="text.secondary">
            O sistema está a operar normalmente.{" "}
            <span
              style={{
                color: "var(--fcc-ready)",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <span className="fcc-ready-dot" />
              Live
            </span>
          </Typography>
        </Box>

        <Box
          sx={{
            px: 2,
            py: 1,
            bgcolor: "background.paper",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              color: "primary.main",
              textTransform: "uppercase",
            }}
          >
            {nowLabel}
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Hoje"
            value="142"
            icon={Users}
            tone="flow"
            trend="+12%"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Em Espera" value="08" icon={Clock} tone="watch" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Atendidos"
            value="134"
            icon={CheckCircle2}
            tone="ready"
            trend="94%"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Tempo Médio"
            value="14min"
            icon={Activity}
            tone="stable"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 5, height: "100%" }}
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mb: 2.25 }}
            >
              <Monitor size={20} color="var(--fcc-flow)" />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Status dos Balcões
              </Typography>
            </Stack>

            <Grid container spacing={1.5}>
              {[1, 2, 3, 4].map((i) => {
                const active = i === 1;
                return (
                  <Grid size={{ xs: 12, sm: 6 }} key={i}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 4,
                        border: "1px solid",
                        borderColor: active ? "success.light" : "divider",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        bgcolor: active
                          ? (theme) => alpha(theme.palette.success.main, 0.04)
                          : "transparent",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 800, color: "text.disabled" }}
                        >
                          BALCAO 0{i}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 800 }}
                        >
                          {active ? "Em Atendimento" : "Disponível"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: active ? "success.main" : "grey.300",
                          boxShadow: active
                            ? (theme) =>
                                `0 0 10px ${alpha(theme.palette.success.main, 0.45)}`
                            : "none",
                        }}
                      />
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            sx={{
              p: { xs: 2, md: 2.5 },
              borderRadius: 5,
              height: "100%",
              background: (theme) =>
                `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.94)} 0%, ${theme.palette.primary.dark} 100%)`,
              color: "white",
            }}
          >
            <Stack spacing={2} sx={{ minHeight: 240 }}>
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
                  sx={{ opacity: 0.72, fontFamily: "monospace" }}
                >
                  v7.3.7-stable
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Todos os logs de atendimento estão assinados e verificados
                criptograficamente.
              </Typography>

              <Box sx={{ flex: 1 }} />

              <Typography
                variant="h2"
                sx={{ fontWeight: 900, textAlign: "right", opacity: 0.25 }}
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

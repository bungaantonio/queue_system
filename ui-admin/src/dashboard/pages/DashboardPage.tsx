// pages/DashboardPage.tsx
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Fade,
} from "@mui/material";
import { KpiBar } from "../../modules/dashboard/components/KpiBar.tsx";
import { ChartSection } from "../../modules/dashboard/components/ChartSection.tsx";
import { AlertsPanel } from "../../modules/dashboard/components/AlertsPanel.tsx";
import { RecentActivity } from "../../modules/dashboard/components/RecentActivity.tsx";

const theme = createTheme({
  palette: {
    mode: "light",
    background: { default: "#F8FAFC", paper: "#FFFFFF" },
    primary: { main: "#1E40AF", light: "#3B82F6", dark: "#1E3A8A" },
    secondary: { main: "#64748B", light: "#94A3B8", dark: "#475569" },
    success: { main: "#059669", light: "#10B981", dark: "#047857" },
    warning: { main: "#D97706", light: "#F59E0B", dark: "#B45309" },
    error: { main: "#DC2626", light: "#EF4444", dark: "#B91C1C" },
    info: { main: "#0284C7", light: "#0EA5E9", dark: "#0369A1" },
    text: { primary: "#1F2937", secondary: "#6B7280" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontWeight: 600, letterSpacing: "-0.01em" },
    h4: { fontWeight: 700, letterSpacing: "-0.02em" },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { lineHeight: 1.6 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
          border: "1px solid #E2E8F0",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #E2E8F0",
          "&:hover": {
            boxShadow:
              "0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)",
            transition: "box-shadow 0.3s ease-in-out",
          },
        },
      },
    },
  },
});

export const DashboardPage = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default",
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Fade in={true} timeout={1000}>
            <Box>
              {/* Header */}
              <Box sx={{ mb: 6 }}>
                <Box
                  component="h1"
                  sx={{
                    typography: "h3",
                    fontWeight: 700,
                    color: "text.primary",
                    mb: 2,
                  }}
                >
                  Dashboard de Analytics
                </Box>
                <Box
                  component="p"
                  sx={{
                    typography: "h6",
                    color: "text.secondary",
                    fontWeight: 400,
                  }}
                >
                  Insights de performance e métricas de gestão de filas
                </Box>
              </Box>

              {/* KPIs */}
              <KpiBar />

              {/* Charts */}
              <ChartSection />

              {/* Painéis inferiores */}
              <Box
                sx={{
                  display: "grid",
                  gap: 4,
                  mt: 4,
                  gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
                }}
              >
                <AlertsPanel />
                <RecentActivity />
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

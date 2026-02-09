// src/ui/theme.ts
import { defaultTheme } from "react-admin";
import { createTheme, alpha } from "@mui/material/styles";

const DNA = {
  sky: "#0EA5E9", // Ação / Fluidez
  amber: "#F59E0B", // Alerta / Atenção
  slate: "#0F172A", // Estrutura / Texto
  canvas: "#F1F5F9", // Fundo
};

export const premiumTheme = createTheme({
  ...defaultTheme,
  palette: {
    primary: { main: DNA.sky },
    secondary: { main: DNA.amber },
    background: { default: DNA.canvas, paper: "#FFFFFF" },
    text: { primary: DNA.slate, secondary: "#64748B" },
  },
  shape: { borderRadius: 32 }, // Bordas "Pill" para os componentes
  typography: {
    fontFamily: '"Inter", sans-serif',
    h3: { fontWeight: 900, letterSpacing: "-0.05em" },
    h6: {
      fontWeight: 800,
      textTransform: "uppercase",
      fontSize: "0.75rem",
      letterSpacing: "0.1em",
    },
    button: { fontWeight: 800, textTransform: "none" },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)",
          border: "1px solid rgba(15, 23, 42, 0.05)",
          padding: "24px",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#FFFFFF", 0.85),
          backdropFilter: "blur(20px)",
          color: DNA.slate,
          boxShadow: "none",
          borderBottom: "1px solid rgba(15, 23, 42, 0.1)",
          height: 80,
          justifyContent: "center",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: "none",
          backgroundColor: DNA.canvas,
          padding: "16px",
        },
      },
    },
  },
});

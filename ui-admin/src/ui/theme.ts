// src/ui/theme.ts
import { defaultTheme } from "react-admin";
import { createTheme, alpha } from "@mui/material/styles";

const DNA = {
  sky: "#0EA5E9",
  amber: "#F59E0B",
  slate: "#0F172A",
  canvas: "#F1F5F9",
  white: "#FFFFFF",
};

export const premiumTheme = createTheme({
  ...defaultTheme,
  palette: {
    primary: { main: DNA.sky },
    secondary: { main: DNA.amber },
    background: { default: DNA.canvas, paper: DNA.white },
    text: { primary: DNA.slate, secondary: "#64748B" },
    divider: "rgba(15, 23, 42, 0.08)",
  },
  shape: { borderRadius: 12 }, // 12px é o "sweet spot" para UI moderna
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h1: { fontWeight: 900 },
    h5: { fontWeight: 800, letterSpacing: "-0.02em" },
    h6: {
      fontWeight: 700,
      textTransform: "uppercase",
      fontSize: "0.7rem",
      letterSpacing: "0.12em",
      color: "#64748B",
    },
    button: { fontWeight: 700, textTransform: "none" },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          border: "1px solid rgba(15, 23, 42, 0.05)",
          borderRadius: 16, // Cards um pouco mais arredondados que o padrão
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10, // Botões menos arredondados que cards para parecerem "clicáveis"
          padding: "8px 16px",
        },
        containedPrimary: {
          boxShadow: `0 4px 14px 0 ${alpha(DNA.sky, 0.39)}`,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(15, 23, 42, 0.05)",
          padding: "16px",
        },
        head: {
          fontWeight: 700,
          backgroundColor: DNA.canvas,
          color: "#64748B",
        },
      },
    },
  },
});

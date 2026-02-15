// src/ui/theme.ts
import { defaultTheme } from "react-admin";
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  ...defaultTheme,
  palette: {
    primary: {
      main: "#4f46e5", // Indigo 600
      dark: "#4338ca",
      light: "#818cf8",
    },
    secondary: {
      main: "#f59e0b", // Amber 500 (SLA/Alerta)
    },
    background: {
      default: "#F8FAFC", // Slate 50 (Fundo do Display)
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a", // Slate 900
      secondary: "#64748b", // Slate 500
    },
    error: {
      main: "#ef4444",
    },
    success: {
      main: "#10b981", // Emerald 500 (Guichê Livre)
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 900, letterSpacing: "-0.05em" },
    h2: { fontWeight: 900, letterSpacing: "-0.05em" },
    h3: { fontWeight: 900, letterSpacing: "-0.05em" },
    h4: { fontWeight: 900, letterSpacing: "-0.02em" },
    h5: { fontWeight: 800 },
    h6: { fontWeight: 800 },
    button: {
      fontWeight: 700,
      textTransform: "none",
      letterSpacing: "0.02em",
    },
  },
  shape: {
    borderRadius: 16, // Arredondamento consistente
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "8px 20px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.2)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          border: "1px solid #f1f5f9", // Slate 100
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 800,
          backgroundColor: "#F8FAFC",
          textTransform: "uppercase",
          fontSize: "0.75rem",
          letterSpacing: "0.1em",
          color: "#64748b",
        },
      },
    },
  },
});

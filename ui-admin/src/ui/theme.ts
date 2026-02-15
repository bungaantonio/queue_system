import { defaultTheme } from "react-admin";
import { createTheme, alpha } from "@mui/material/styles";

// 1. Definição de Cores e Identidade (DNA)
const palette = {
  primary: {
    main: "#4f46e5", // Indigo 600
    light: "#818cf8",
    dark: "#3730a3",
    contrastText: "#ffffff",
  },
  success: {
    main: "#10b981", // Emerald 500
    contrastText: "#ffffff",
  },
  warning: {
    main: "#f59e0b", // Amber 500
  },
  error: {
    main: "#e11d48", // Rose 600
  },
  background: {
    default: "#f8fafc", // Slate 50 (Fundo frio para reduzir fadiga)
    paper: "#ffffff",
  },
  text: {
    primary: "#0f172a", // Slate 900
    secondary: "#64748b", // Slate 500
  },
  divider: "#e2e8f0", // Slate 200
};

// 2. O Tema Customizado
export const theme = createTheme({
  ...defaultTheme,
  palette,
  shape: {
    borderRadius: 12, // Border-radius base para UI geral
  },
  typography: {
    fontFamily: '"Inter", "system-ui", "-apple-system", "sans-serif"',
    h1: { fontWeight: 900, letterSpacing: "-0.05em" },
    h2: { fontWeight: 900, letterSpacing: "-0.05em" },
    h3: { fontWeight: 800, letterSpacing: "-0.02em" },
    h4: { fontWeight: 800, letterSpacing: "-0.02em" },
    subtitle1: { fontWeight: 700, fontSize: "1rem" },
    subtitle2: {
      fontWeight: 800,
      fontSize: "0.75rem",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
    },
    body1: { fontSize: "0.925rem", lineHeight: 1.6 },
    button: { fontWeight: 700, textTransform: "none", letterSpacing: "0.02em" },
    caption: { fontWeight: 600, letterSpacing: "0.02em" },
  },
  components: {
    // Normalização Global: O fim do "Engessado"
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: palette.background.default,
          // Scrollbar técnica e discreta
          "&::-webkit-scrollbar": { width: 6, height: 6 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#cbd5e1",
            borderRadius: 10,
          },
          "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
        },
        // Correção de espaçamento do React Admin
        ".RaLayout-content": {
          padding: "24px !important",
          margin: "0 auto",
          maxWidth: "1600px", // Limite para monitores Ultra-wide
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        },
        ".RaLayout-appFrame": {
          marginTop: "70px", // Espaço para o AppBar Glassmorphism
        },
      },
    },

    // Superfícies de Trabalho (Cards)
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24, // DNA da TV: Bordas largas nos containers principais
          border: `1px solid ${palette.divider}`,
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.02), 0 1px 2px -1px rgba(0, 0, 0, 0.02)",
          overflow: "hidden",
        },
      },
    },

    // Tabelas Técnicas (Admin e Auditor)
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "16px 24px",
          borderColor: alpha(palette.divider, 0.5),
        },
        head: {
          backgroundColor: palette.background.default,
          color: palette.text.secondary,
          fontWeight: 800,
          textTransform: "uppercase",
          fontSize: "0.65rem",
          letterSpacing: "0.1em",
          paddingTop: 12,
          paddingBottom: 12,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&.MuiTableRow-hover:hover": {
            backgroundColor: alpha(palette.primary.main, 0.02),
          },
          // Números tabulares para IDs e Tickets
          "& td": { fontVariantNumeric: "tabular-nums" },
        },
      },
    },

    // Formulários: O fim do input "mecânico"
    MuiFilledInput: {
      defaultProps: { disableUnderline: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: alpha(palette.text.secondary, 0.06),
          border: "1px solid transparent",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": { backgroundColor: alpha(palette.text.secondary, 0.1) },
          "&.Mui-focused": {
            backgroundColor: "#ffffff",
            borderColor: palette.primary.main,
            boxShadow: `0 0 0 4px ${alpha(palette.primary.main, 0.1)}`,
          },
        },
      },
    },

    // Botões de Ação
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 10, // Equilíbrio entre o Card e o Input
          padding: "10px 24px",
          fontWeight: 800,
        },
        containedPrimary: {
          background: `linear-gradient(180deg, ${palette.primary.main} 0%, ${palette.primary.dark} 100%)`,
          boxShadow: `0 4px 12px ${alpha(palette.primary.main, 0.2)}`,
        },
      },
    },

    // React Admin Specifics
    RaDatagrid: {
      styleOverrides: {
        root: {
          "& .RaDatagrid-headerCell": {
            backgroundColor: palette.background.default,
          },
        },
      },
    },
  },
});

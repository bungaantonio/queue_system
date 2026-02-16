import { defaultTheme } from "react-admin";
import { createTheme, alpha } from "@mui/material/styles";

// 1. Definicao de Cores e Identidade (DNA)
const palette = {
  primary: {
    main: "#4f46e5", // Indigo 600 (Fluxo)
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

// 2. Tema customizado
export const theme = createTheme(defaultTheme, {
  palette,
  shape: {
    borderRadius: 10,
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
        "@keyframes fccFadeInUp": {
          from: {
            opacity: 0,
            transform: "translateY(6px)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
        "@keyframes fccPulseReady": {
          "0%, 100%": {
            opacity: 1,
            boxShadow: `0 0 0 0 ${alpha(palette.success.main, 0.3)}`,
          },
          "50%": {
            opacity: 0.85,
            boxShadow: `0 0 0 7px ${alpha(palette.success.main, 0)}`,
          },
        },
        ":root": {
          "--fcc-flow": palette.primary.main,
          "--fcc-stable": palette.text.primary,
          "--fcc-ready": palette.success.main,
          "--fcc-watch": palette.warning.main,
          "--fcc-rigor": palette.error.main,
        },
        body: {
          background:
            "radial-gradient(circle at 0% 0%, rgba(79,70,229,0.06) 0%, rgba(79,70,229,0) 38%), #f8fafc",
          color: palette.text.primary,
          // Scrollbar técnica e discreta
          "&::-webkit-scrollbar": { width: 6, height: 6 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#cbd5e1",
            borderRadius: 10,
          },
          "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
          scrollBehavior: "smooth",
        },
        // React Admin layout: manter fluido sem deslocar app frame
        ".RaLayout-content": {
          boxSizing: "border-box",
        },
        ".RaLayout-content > *": {
          animation: "fccFadeInUp 220ms ease-out",
        },
        ".fcc-ready-dot": {
          display: "inline-block",
          width: 9,
          height: 9,
          borderRadius: "50%",
          backgroundColor: palette.success.main,
          animation: "fccPulseReady 1.8s ease-in-out infinite",
          marginRight: 6,
          verticalAlign: "middle",
        },
        "@media (prefers-reduced-motion: reduce)": {
          ".RaLayout-content > *": {
            animation: "none",
          },
          ".fcc-ready-dot": {
            animation: "none",
          },
        },
      },
    },

    // Superfícies de Trabalho (Cards)
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: `1px solid ${palette.divider}`,
          boxShadow:
            "0 1px 3px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.04)",
          overflow: "hidden",
          transition: "transform 160ms ease, box-shadow 160ms ease",
          "&:hover": {
            boxShadow:
              "0 2px 6px rgba(15,23,42,0.06), 0 12px 28px rgba(15,23,42,0.08)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: `1px solid ${palette.divider}`,
          boxShadow:
            "0 1px 3px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.04)",
          backgroundImage: "none",
          transition: "box-shadow 160ms ease",
        },
      },
    },

    // Tabelas Técnicas (Admin e Auditor)
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "12px 14px",
          borderColor: alpha(palette.divider, 0.5),
        },
        head: {
          backgroundColor: palette.background.default,
          color: palette.text.secondary,
          fontWeight: 800,
          textTransform: "uppercase",
          fontSize: "0.65rem",
          letterSpacing: "0.1em",
          paddingTop: 10,
          paddingBottom: 10,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&.MuiTableRow-hover:hover": {
            backgroundColor: alpha(palette.primary.main, 0.035),
          },
          transition: "background-color 140ms ease",
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
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: alpha(palette.text.secondary, 0.03),
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha(palette.primary.main, 0.35),
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: palette.primary.main,
            borderWidth: 2,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 800,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          borderRadius: 8,
          transition: "all 160ms ease",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "all 140ms ease",
          "&:hover": {
            backgroundColor: alpha(palette.primary.main, 0.08),
          },
          "&:active": {
            transform: "scale(0.97)",
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
          padding: "8px 16px",
          fontWeight: 800,
          transition:
            "transform 120ms ease, box-shadow 160ms ease, background-color 160ms ease",
          "&:active": {
            transform: "translateY(1px)",
          },
          "&.Mui-focusVisible": {
            boxShadow: `0 0 0 4px ${alpha(palette.primary.main, 0.2)}`,
          },
        },
        contained: {
          background: `linear-gradient(180deg, ${palette.primary.main} 0%, ${palette.primary.dark} 100%)`,
          boxShadow: `0 4px 12px ${alpha(palette.primary.main, 0.2)}`,
          "&:hover": {
            boxShadow: `0 8px 20px ${alpha(palette.primary.main, 0.24)}`,
          },
        },
        containedSuccess: {
          background: `linear-gradient(180deg, ${palette.success.main} 0%, #0f9f6e 100%)`,
          boxShadow: `0 4px 12px ${alpha(palette.success.main, 0.24)}`,
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

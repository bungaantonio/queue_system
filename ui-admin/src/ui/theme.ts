// src/ui/theme.ts
import { defaultTheme } from "react-admin";
import { createTheme, alpha } from "@mui/material/styles";

// ─── Tokens ────────────────────────────────────────────────────────────────────
const BRAND = "#4338ca";          // indigo-700 — mais saturado que o anterior
const BRAND_LIGHT = alpha(BRAND, 0.08);
const SURFACE = "#ffffff";
const CANVAS = "#f8f7ff";         // branco com levíssimo toque roxo — afasta do cinza genérico
const BORDER = "#e4e2f5";
const TEXT_STRONG = "#18181b";
const TEXT_MUTED = "#71717a";
const FONT = '"DM Sans", "Helvetica Neue", sans-serif';

// ─── Tema ──────────────────────────────────────────────────────────────────────
export const theme = createTheme({
  // Herdar apenas o necessário do defaultTheme sem deepmerge
  ...defaultTheme,

  palette: {
    mode: "light",
    primary: {
      main: BRAND,
      light: alpha(BRAND, 0.12),
      dark: "#3730a3",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#0ea5e9",
      contrastText: "#ffffff",
    },
    background: {
      default: CANVAS,
      paper: SURFACE,
    },
    text: {
      primary: TEXT_STRONG,
      secondary: TEXT_MUTED,
    },
    divider: BORDER,
    error: { main: "#ef4444" },
    warning: { main: "#f59e0b" },
    success: { main: "#10b981" },
  },

  typography: {
    fontFamily: FONT,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: { fontWeight: 800, letterSpacing: "-0.03em" },
    h2: { fontWeight: 800, letterSpacing: "-0.025em" },
    h3: { fontWeight: 700, letterSpacing: "-0.02em" },
    h4: { fontWeight: 700, letterSpacing: "-0.02em" },
    h5: { fontWeight: 700, letterSpacing: "-0.015em" },
    h6: { fontWeight: 700, letterSpacing: "-0.015em", fontSize: "1rem" },
    subtitle1: { fontWeight: 600, letterSpacing: "-0.01em" },
    subtitle2: { fontWeight: 600, fontSize: "0.8125rem" },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.55, color: TEXT_MUTED },
    button: { textTransform: "none", fontWeight: 600, letterSpacing: "-0.01em" },
    overline: {
      fontWeight: 700,
      fontSize: "0.6875rem",
      letterSpacing: "0.08em",
    },
    caption: { color: TEXT_MUTED },
  },

  shape: { borderRadius: 10 },

  shadows: [
    "none",
    "0 1px 2px 0 rgba(0,0,0,.05)",
    "0 1px 3px 0 rgba(0,0,0,.07), 0 1px 2px -1px rgba(0,0,0,.04)",
    "0 4px 6px -1px rgba(0,0,0,.07), 0 2px 4px -2px rgba(0,0,0,.04)",
    "0 10px 15px -3px rgba(0,0,0,.07), 0 4px 6px -4px rgba(0,0,0,.04)",
    "0 20px 25px -5px rgba(0,0,0,.07), 0 8px 10px -6px rgba(0,0,0,.04)",
    "0 25px 50px -12px rgba(0,0,0,.18)",
    ...Array(19).fill("none"),
  ] as any,

  components: {
    // ── Reset de defaults do MUI ────────────────────────────────────────────
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { background-color: ${CANVAS}; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${BORDER}; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: ${alpha(BRAND, 0.3)}; }
      `,
    },

    // ── Layout ──────────────────────────────────────────────────────────────
    RaLayout: {
      styleOverrides: {
        root: {
          backgroundColor: CANVAS,
        },
        content: {
          backgroundColor: "transparent",
          padding: "28px 32px",
          "@media (max-width:899.95px)": {
            padding: "16px",
          },
          // Remove o margin-top que o react-admin injeta
          marginTop: "0 !important",
        },
      },
    },

    // ── AppBar ──────────────────────────────────────────────────────────────
    RaAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          color: TEXT_STRONG,
          boxShadow: "none",
          borderBottom: `1px solid ${BORDER}`,
          // Linha de acento no topo — o detalhe que diferencia
          borderTop: `3px solid ${BRAND}`,
        },
        toolbar: {
          minHeight: "56px !important",
        },
      },
    },

    // ── Sidebar ─────────────────────────────────────────────────────────────
    RaSidebar: {
      styleOverrides: {
        root: {
          // A largura correcta no MUI v7 / RA v5
          width: 240,
          "& .MuiDrawer-paper": {
            width: 240,
            backgroundColor: SURFACE,
            borderRight: `1px solid ${BORDER}`,
            boxShadow: "none",
          },
        },
        fixed: {
          backgroundColor: SURFACE,
          borderRight: `1px solid ${BORDER}`,
          width: 240,
        },
      },
    },

    // ── Menu ────────────────────────────────────────────────────────────────
    RaMenu: {
      styleOverrides: {
        root: {
          padding: "8px 0",
          width: "100%",
        },
      },
    },

    // ── Menu Item ───────────────────────────────────────────────────────────
    RaMenuItemLink: {
      styleOverrides: {
        root: {
          margin: "2px 10px",
          borderRadius: 8,
          padding: "9px 14px",
          fontSize: "0.875rem",
          fontWeight: 500,
          color: TEXT_MUTED,
          gap: 10,
          transition: "background 0.15s, color 0.15s",
          "&:hover": {
            backgroundColor: BRAND_LIGHT,
            color: BRAND,
            "& .RaMenuItemLink-icon": { color: BRAND },
          },
          "&.RaMenuItemLink-active": {
            backgroundColor: BRAND_LIGHT,
            color: BRAND,
            fontWeight: 700,
            "& .RaMenuItemLink-icon": { color: BRAND },
          },
        },
        icon: {
          minWidth: "unset",
          color: TEXT_MUTED,
          "& svg": { width: 18, height: 18 },
        },
      },
    },

    // ── Subheader de secção no menu ─────────────────────────────────────────
    MuiListSubheader: {
      styleOverrides: {
        root: {
          "&.MyMenu-section": {
            backgroundColor: "transparent",
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: "0.6875rem",
            letterSpacing: "0.08em",
            color: alpha(TEXT_MUTED, 0.7),
            textTransform: "uppercase",
            padding: "20px 24px 6px",
            lineHeight: 1,
          },
        },
      },
    },

    // ── Cards / Paper ────────────────────────────────────────────────────────
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: `1px solid ${BORDER}`,
        },
        elevation1: {
          boxShadow: "0 1px 3px 0 rgba(0,0,0,.07), 0 1px 2px -1px rgba(0,0,0,.04)",
          border: "none",
        },
      },
    },

    // ── Card ─────────────────────────────────────────────────────────────────
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${BORDER}`,
          boxShadow: "none",
          borderRadius: 12,
          transition: "box-shadow 0.2s, border-color 0.2s",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(67,56,202,.08)",
            borderColor: alpha(BRAND, 0.3),
          },
        },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: { padding: "20px 24px", "&:last-child": { paddingBottom: 20 } },
      },
    },

    // ── Botões ───────────────────────────────────────────────────────────────
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 16px",
          fontSize: "0.875rem",
          fontWeight: 600,
          transition: "all 0.15s",
        },
        contained: {
          background: `linear-gradient(135deg, ${BRAND} 0%, #6366f1 100%)`,
          "&:hover": {
            background: `linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)`,
            boxShadow: `0 4px 14px ${alpha(BRAND, 0.4)}`,
          },
        },
        outlined: {
          borderColor: BORDER,
          color: TEXT_STRONG,
          "&:hover": {
            borderColor: BRAND,
            backgroundColor: BRAND_LIGHT,
            color: BRAND,
          },
        },
        text: {
          "&:hover": { backgroundColor: BRAND_LIGHT, color: BRAND },
        },
        sizeSmall: { padding: "5px 12px", fontSize: "0.8125rem" },
        sizeLarge: { padding: "11px 24px", fontSize: "1rem" },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: "background 0.15s",
          "&:hover": { backgroundColor: BRAND_LIGHT, color: BRAND },
        },
      },
    },

    // ── Inputs ───────────────────────────────────────────────────────────────
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: SURFACE,
          transition: "border-color 0.15s, box-shadow 0.15s",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: BORDER },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha(BRAND, 0.5) },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: BRAND,
            borderWidth: 1.5,
          },
          "&.Mui-focused": {
            boxShadow: `0 0 0 3px ${alpha(BRAND, 0.1)}`,
          },
        },
        input: { padding: "10px 14px" },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          fontWeight: 500,
          color: TEXT_MUTED,
          "&.Mui-focused": { color: BRAND },
        },
      },
    },

    // ── Tabela (Datagrid / List) ──────────────────────────────────────────────
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            backgroundColor: "#f4f3ff",
            color: TEXT_MUTED,
            fontWeight: 700,
            fontSize: "0.75rem",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            borderBottom: `1px solid ${BORDER}`,
            padding: "10px 16px",
          },
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: "background 0.1s",
          "&:hover": { backgroundColor: "#fafafe" },
          "&.Mui-selected": {
            backgroundColor: `${BRAND_LIGHT} !important`,
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${BORDER}`,
          padding: "12px 16px",
          fontSize: "0.875rem",
          color: TEXT_STRONG,
        },
      },
    },

    // ── Chips ────────────────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: "0.75rem",
          height: 24,
          borderRadius: 6,
        },
        colorPrimary: {
          backgroundColor: BRAND_LIGHT,
          color: BRAND,
        },
      },
    },

    // ── Tooltip ──────────────────────────────────────────────────────────────
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: TEXT_STRONG,
          fontFamily: FONT,
          fontSize: "0.75rem",
          fontWeight: 500,
          borderRadius: 6,
          padding: "5px 10px",
        },
        arrow: { color: TEXT_STRONG },
      },
    },

    // ── Snackbar / Notificações RA ───────────────────────────────────────────
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontSize: "0.875rem",
          fontWeight: 500,
          border: `1px solid`,
        },
        standardSuccess: {
          backgroundColor: "#f0fdf4",
          borderColor: "#bbf7d0",
          color: "#166534",
        },
        standardError: {
          backgroundColor: "#fef2f2",
          borderColor: "#fecaca",
          color: "#991b1b",
        },
        standardWarning: {
          backgroundColor: "#fffbeb",
          borderColor: "#fde68a",
          color: "#92400e",
        },
        standardInfo: {
          backgroundColor: "#eff6ff",
          borderColor: "#bfdbfe",
          color: "#1e40af",
        },
      },
    },

    // ── Divisor ──────────────────────────────────────────────────────────────
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: BORDER },
      },
    },

    // ── Breadcrumbs ──────────────────────────────────────────────────────────
    MuiBreadcrumbs: {
      styleOverrides: {
        root: { fontSize: "0.8125rem" },
        separator: { color: alpha(TEXT_MUTED, 0.5) },
      },
    },

    // ── Toolbar do List (filtros) ────────────────────────────────────────────
    RaTopToolbar: {
      styleOverrides: {
        root: {
          paddingBottom: 8,
          alignItems: "center",
          gap: 8,
        },
      },
    },

    // ── FilterForm ───────────────────────────────────────────────────────────
    RaFilterForm: {
      styleOverrides: {
        root: {
          "& .MuiFormControl-root": { minWidth: 160 },
        },
      },
    },

    // ── Datagrid RA ──────────────────────────────────────────────────────────
    RaDatagrid: {
      styleOverrides: {
        root: {
          "& .RaDatagrid-headerCell": {
            backgroundColor: "#f4f3ff",
            fontWeight: 700,
            fontSize: "0.75rem",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: TEXT_MUTED,
          },
          "& .RaDatagrid-rowEven": {
            backgroundColor: SURFACE,
          },
          "& .RaDatagrid-rowOdd": {
            backgroundColor: "#fdfcff",
          },
          "& .RaDatagrid-row:hover td": {
            backgroundColor: "#f4f3ff",
          },
          "& .RaDatagrid-clickableRow": {
            cursor: "pointer",
          },
        },
      },
    },
  },
});
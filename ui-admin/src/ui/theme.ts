// src/ui/theme.ts
import { defaultTheme } from "react-admin";
import { createTheme, alpha } from "@mui/material/styles";
import { deepmerge } from "@mui/utils";

const palette = {
  primary: { main: "#4f46e5" },
  background: { default: "#f1f5f9", paper: "#ffffff" },
  text: { primary: "#1e293b", secondary: "#64748b" },
  divider: "#e2e8f0",
};

export const theme = createTheme(
  deepmerge(defaultTheme, {
    palette,
    cssVariables: true,
    typography: {
      fontFamily: '"Inter", "system-ui", sans-serif',
      h6: { fontWeight: 800, letterSpacing: "-0.02em" },
      button: { textTransform: "none", fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
    components: {
      RaMenu: {
        styleOverrides: {
          root: {
            marginTop: 8,
          },
        },
      },
      RaLayout: {
        styleOverrides: {
          root: {
            backgroundColor: "var(--mui-palette-background-default)",
          },
          content: {
            padding: 32,
            backgroundColor: "transparent",
            display: "flex",
            flexDirection: "column",
            "@media (max-width:899.95px)": {
              padding: 16,
            },
          },
        },
      },
      RaAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(12px)",
            color: "var(--mui-palette-text-primary)",
            boxShadow: "none",
            borderBottom: "1px solid var(--mui-palette-divider)",
          },
          title: {
            fontWeight: 800,
            fontSize: "1rem",
            letterSpacing: "-0.02em",
          },
        },
      },
      RaSidebar: {
        styleOverrides: {
          fixed: {
            backgroundColor: "var(--mui-palette-background-paper)",
            borderRight: "1px solid var(--mui-palette-divider)",
          },
        },
      },
      RaMenuItemLink: {
        styleOverrides: {
          root: {
            margin: "4px 12px",
            borderRadius: 8,
            padding: "10px 16px",
            color: "var(--mui-palette-text-secondary)",
            transition: "all 0.2s ease",
            "&.RaMenuItemLink-active": {
              backgroundColor: alpha("#4f46e5", 0.08),
              color: "var(--mui-palette-primary-main)",
              fontWeight: 700,
              "& .RaMenuItemLink-icon": {
                color: "var(--mui-palette-primary-main)",
              },
            },
          },
        },
      },
      MuiListSubheader: {
        styleOverrides: {
          root: {
            "&.MyMenu-section": {
              backgroundColor: "transparent",
              fontWeight: 800,
              fontSize: "0.65rem",
              marginTop: 16,
              lineHeight: 1.8,
              color: "var(--mui-palette-text-secondary)",
            },
          },
        },
      },
    },
  }),
);

// src/ui/theme.ts
import { defaultTheme } from "react-admin";
import { createTheme, alpha } from "@mui/material/styles";
import { deepmerge } from "@mui/utils";

const palette = {
  primary: {
    main: "#4f46e5",
    light: "#6366f1",
    dark: "#4338ca",
    lighter: "#eef2ff",
  },
  secondary: {
    main: "#06b6d4",
    light: "#22d3ee",
    dark: "#0891b2",
  },
  success: {
    main: "#10b981",
    light: "#6ee7b7",
    dark: "#059669",
  },
  warning: {
    main: "#f59e0b",
    light: "#fcd34d",
    dark: "#d97706",
  },
  error: {
    main: "#ef4444",
    light: "#f87171",
    dark: "#dc2626",
  },
  background: {
    default: "#f8fafc",
    paper: "#ffffff",
  },
  text: {
    primary: "#0f172a",
    secondary: "#64748b",
  },
  divider: "#e2e8f0",
};

export const theme = createTheme(
  deepmerge(defaultTheme, {
    palette,
    cssVariables: true,
    typography: {
      fontFamily: '"Inter", "system-ui", -apple-system, sans-serif',
      h1: { fontWeight: 900, letterSpacing: "-0.03em", fontSize: "2.5rem" },
      h2: { fontWeight: 900, letterSpacing: "-0.025em", fontSize: "2rem" },
      h3: { fontWeight: 800, letterSpacing: "-0.02em", fontSize: "1.5rem" },
      h4: { fontWeight: 800, letterSpacing: "-0.015em", fontSize: "1.25rem" },
      h5: { fontWeight: 700, letterSpacing: "-0.01em", fontSize: "1.125rem" },
      h6: { fontWeight: 800, letterSpacing: "-0.02em" },
      subtitle1: { fontWeight: 600, fontSize: "1rem" },
      subtitle2: { fontWeight: 700, fontSize: "0.875rem" },
      body1: { fontWeight: 400, lineHeight: 1.6 },
      body2: { fontWeight: 400, lineHeight: 1.5 },
      button: {
        textTransform: "none",
        fontWeight: 600,
        letterSpacing: "0.3px",
      },
      caption: { fontWeight: 500 },
      overline: {
        fontWeight: 800,
        letterSpacing: "1.5px",
        fontSize: "0.65rem",
      },
    },
    shape: { borderRadius: 12 },
    shadows: [
      "none",
      `0 1px 2px 0 ${alpha("#000", 0.05)}`,
      `0 1px 3px 0 ${alpha("#000", 0.1)}`,
      `0 4px 6px -1px ${alpha("#000", 0.1)}`,
      `0 10px 15px -3px ${alpha("#000", 0.1)}`,
      `0 20px 25px -5px ${alpha("#000", 0.1)}`,
      `0 25px 50px -12px ${alpha("#000", 0.15)}`,
      ...Array(18).fill(""),
    ].map((_, i) =>
      i < 7 ? _ : `0 25px 50px -12px ${alpha("#000", 0.15 + i * 0.01)}`,
    ),
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollBehavior: "smooth",
          },
          "*::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "*::-webkit-scrollbar-track": {
            backgroundColor: alpha(palette.divider, 0.3),
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: alpha(palette.text.secondary, 0.3),
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: alpha(palette.text.secondary, 0.5),
            },
          },
        },
      },

      RaLayout: {
        styleOverrides: {
          root: {
            backgroundColor: palette.background.default,
          },
          content: {
            padding: 0,
            backgroundColor: "transparent",
          },
        },
      },

      RaSidebar: {
        styleOverrides: {
          fixed: {
            backgroundColor: palette.background.paper,
            borderRight: `1px solid ${palette.divider}`,
            boxShadow: `4px 0 12px ${alpha("#000", 0.04)}`,
          },
          permanent: {
            backgroundColor: palette.background.paper,
          },
        },
      },

      RaAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: alpha("#ffffff", 0.8),
            backdropFilter: "blur(20px)",
            boxShadow: `0 1px 3px ${alpha("#000", 0.08)}`,
            borderBottom: `1px solid ${alpha(palette.divider, 0.6)}`,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            color: palette.text.primary,
          },
          toolbar: {
            minHeight: "64px",
            paddingLeft: "16px",
            paddingRight: "16px",
            gap: "16px",
          },
          title: {
            fontWeight: 800,
            fontSize: "1.125rem",
            letterSpacing: "-0.02em",
            flex: 1,
          },
        },
      },

      RaMenu: {
        styleOverrides: {
          root: {
            marginTop: "8px",
            paddingBottom: "16px",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
          },
        },
      },

      RaMenuItemLink: {
        styleOverrides: {
          root: {
            margin: "4px 12px",
            borderRadius: "10px",
            padding: "10px 16px",
            color: palette.text.secondary,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",

            "&::before": {
              content: '""',
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              width: "3px",
              height: "0%",
              backgroundColor: palette.primary.main,
              borderRadius: "0 2px 2px 0",
              transition: "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            },

            "&:hover": {
              backgroundColor: alpha(palette.primary.main, 0.06),
              color: palette.text.primary,
              transform: "translateX(4px)",
            },

            "&.RaMenuItemLink-active": {
              backgroundColor: alpha(palette.primary.main, 0.1),
              color: palette.primary.main,
              fontWeight: 700,

              "&::before": {
                height: "60%",
              },

              "& .MuiListItemIcon-root": {
                color: palette.primary.main,
              },
            },
          },

          icon: {
            marginRight: "12px",
            minWidth: "36px",
            color: palette.text.secondary,
            transition: "all 0.3s ease",
          },
        },
      },

      RaDashboardMenuItem: {
        styleOverrides: {
          root: {
            margin: "4px 12px",
            borderRadius: "10px",
            padding: "10px 16px",
            color: palette.text.secondary,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",

            "&:hover": {
              backgroundColor: alpha(palette.primary.main, 0.06),
              color: palette.text.primary,
              transform: "translateX(4px)",
            },

            "&.RaDashboardMenuItem-active": {
              backgroundColor: alpha(palette.primary.main, 0.1),
              color: palette.primary.main,
              fontWeight: 700,

              "& .MuiListItemIcon-root": {
                color: palette.primary.main,
              },
            },
          },

          icon: {
            marginRight: "12px",
            minWidth: "36px",
            color: palette.text.secondary,
            transition: "all 0.3s ease",
          },
        },
      },

      MuiListSubheader: {
        styleOverrides: {
          root: {
            backgroundColor: "transparent",
            fontWeight: 800,
            fontSize: "0.65rem",
            lineHeight: 1.8,
            color: palette.text.secondary,
            paddingLeft: "28px",
            marginTop: "20px",
            marginBottom: "8px",
            letterSpacing: "1.2px",
            textTransform: "uppercase",

            "&.MyMenu-section": {
              backgroundColor: "transparent",
            },
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "10px",
            padding: "8px 20px",
            fontWeight: 600,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            textTransform: "none",

            "&:focus-visible": {
              outline: `2px solid ${palette.primary.main}`,
              outlineOffset: "2px",
            },
          },

          contained: {
            boxShadow: "none",
            border: "none",

            "&:hover": {
              boxShadow: `0 8px 16px ${alpha(palette.primary.main, 0.3)}`,
              transform: "translateY(-2px)",
            },

            "&:active": {
              transform: "translateY(0)",
            },
          },

          outlined: {
            borderWidth: "1.5px",

            "&:hover": {
              borderWidth: "1.5px",
              backgroundColor: alpha(palette.primary.main, 0.04),
            },
          },

          text: {
            "&:hover": {
              backgroundColor: alpha(palette.primary.main, 0.08),
            },
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "16px",
            border: `1px solid ${palette.divider}`,
            boxShadow: `0 1px 3px ${alpha("#000", 0.05)}`,
            backgroundImage: "none",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

            "&:hover": {
              borderColor: alpha(palette.primary.main, 0.2),
              boxShadow: `0 8px 24px ${alpha("#000", 0.08)}`,
            },
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            borderRadius: "16px",
          },

          elevation0: {
            boxShadow: "none",
          },

          elevation1: {
            boxShadow: `0 1px 3px ${alpha("#000", 0.08)}`,
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: "8px",
            height: "28px",
            fontSize: "0.75rem",
            border: "1px solid",
            borderColor: palette.divider,
            transition: "all 0.3s ease",

            "&:hover": {
              backgroundColor: alpha(palette.primary.main, 0.08),
              borderColor: palette.primary.main,
            },
          },

          filled: {
            border: "none",
          },
        },
      },

      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              transition: "all 0.3s ease",

              "&:hover": {
                borderColor: palette.primary.main,
              },

              "&.Mui-focused": {
                boxShadow: `0 0 0 3px ${alpha(palette.primary.main, 0.1)}`,
              },
            },
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "10px",
            transition: "all 0.3s ease",

            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: palette.primary.main,
            },

            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderWidth: "2px",
              borderColor: palette.primary.main,
            },
          },
        },
      },

      MuiSlider: {
        styleOverrides: {
          root: {
            "& .MuiSlider-thumb": {
              backgroundColor: palette.primary.main,
              boxShadow: `0 0 0 8px ${alpha(palette.primary.main, 0.1)}`,

              "&:hover": {
                boxShadow: `0 0 0 12px ${alpha(palette.primary.main, 0.15)}`,
              },
            },

            "& .MuiSlider-track": {
              backgroundColor: palette.primary.main,
            },

            "& .MuiSlider-rail": {
              backgroundColor: palette.divider,
            },
          },
        },
      },

      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: "4px",
            height: "6px",
            backgroundColor: palette.divider,
          },

          bar: {
            borderRadius: "4px",
            background: `linear-gradient(90deg, ${palette.primary.main}, ${palette.primary.light})`,
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: palette.divider,
            fontWeight: 500,
          },

          head: {
            fontWeight: 700,
            backgroundColor: alpha(palette.primary.main, 0.04),
            color: palette.text.primary,
          },
        },
      },

      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: "all 0.3s ease",

            "&:hover": {
              backgroundColor: alpha(palette.primary.main, 0.04),
            },

            "&.Mui-selected": {
              backgroundColor: alpha(palette.primary.main, 0.08),

              "&:hover": {
                backgroundColor: alpha(palette.primary.main, 0.12),
              },
            },
          },
        },
      },

      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: "16px",
            boxShadow: `0 20px 25px -5px ${alpha("#000", 0.15)}`,
          },
        },
      },

      MuiBackdrop: {
        styleOverrides: {
          root: {
            backdropFilter: "blur(4px)",
            backgroundColor: alpha("#000", 0.4),
          },
        },
      },
    },
  }),
);

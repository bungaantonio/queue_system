// src/ui/layout/MyMenu.tsx
import { Menu, MenuProps } from "react-admin";
import { alpha } from "@mui/material";
import type { Theme } from "@mui/material/styles";

export const MyMenu = (props: MenuProps) => (
  <Menu
    {...props}
    sx={{
      width: 236,
      mt: 0.5,
      px: 1,
      py: 0.75,
      borderRight: "1px solid",
      borderColor: "divider",
      backgroundColor: (theme: Theme) =>
        alpha(theme.palette.background.paper, 0.9),
      "& .RaMenuItemLink-root": {
        minHeight: 38,
        px: 1,
        mb: 0.45,
        borderRadius: 2.5,
        border: "1px solid transparent",
        color: "text.secondary",
        fontWeight: 800,
        fontSize: "0.7rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        transition: "all 160ms ease",
        "&:hover": {
          color: "primary.main",
          borderColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.2),
          backgroundColor: (theme: Theme) =>
            alpha(theme.palette.primary.main, 0.06),
        },
        "&.RaMenuItemLink-active": {
          color: "primary.main",
          borderColor: (theme: Theme) =>
            alpha(theme.palette.primary.main, 0.28),
          backgroundColor: (theme: Theme) =>
            alpha(theme.palette.primary.main, 0.1),
          boxShadow: (theme: Theme) =>
            `inset 2px 0 0 ${theme.palette.primary.main}`,
          "& .RaMenuItemLink-icon": {
            color: "primary.main",
          },
        },
      },
      "& .RaMenuItemLink-icon": {
        minWidth: 32,
        fontSize: "1rem",
      },
      "&.RaMenu-closed": {
        width: 74,
        px: 0.5,
      },
      "&.RaMenu-closed .RaMenuItemLink-root": {
        px: 0,
        justifyContent: "center !important",
        borderLeft: "none",
      },
      "&.RaMenu-closed .RaMenuItemLink-icon": {
        minWidth: 0,
      },
      "&.RaMenu-closed .RaMenuItemLink-primaryText": {
        display: "none",
      },
      "&.RaMenu-closed .RaMenuItemLink-active": {
        boxShadow: "none",
      },
    }}
  />
);

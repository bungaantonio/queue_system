// src/ui/layout/MyMenu.tsx
import { Menu, MenuProps } from "react-admin";
import { alpha } from "@mui/material";
import type { Theme } from "@mui/material/styles";

export const MyMenu = (props: MenuProps) => (
  <Menu
    {...props}
    sx={{
      width: 236,
      mt: 1,
      px: 1,
      backgroundColor: "transparent",
      "& .RaMenuItemLink-root": {
        borderRadius: 2.5,
        mb: 0.25,
        py: 1.1,
        fontWeight: 700,
        fontSize: "0.7rem",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "text.secondary",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          backgroundColor: (theme: Theme) =>
            alpha(theme.palette.primary.main, 0.04),
          color: "primary.main",
          transform: "translateX(2px)",
        },
        "&.RaMenuItemLink-active": {
          backgroundColor: (theme: Theme) =>
            alpha(theme.palette.primary.main, 0.1),
          color: "primary.main",
          borderLeft: "3px solid",
          borderColor: "primary.main",
          "& .RaMenuItemLink-icon": {
            color: "primary.main",
          },
        },
      },
      "& .RaMenuItemLink-icon": {
        minWidth: 34,
        fontSize: "1.05rem",
      },
    }}
  />
);

// src/ui/layout/MyMenu.tsx
import { Menu, MenuProps } from "react-admin";
import { alpha } from "@mui/material";

export const MyMenu = (props: MenuProps) => (
  <Menu
    {...props}
    sx={{
      width: 260,
      mt: 2, // Espaço para não colar no AppBar
      px: 1.5,
      backgroundColor: "transparent",
      "& .RaMenuItemLink-root": {
        borderRadius: 3,
        mb: 0.5,
        py: 1.5,
        fontWeight: 700,
        fontSize: "0.75rem",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: "text.secondary",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          backgroundColor: alpha("#4f46e5", 0.04),
          color: "primary.main",
          transform: "translateX(4px)",
        },
        "&.RaMenuItemLink-active": {
          backgroundColor: alpha("#4f46e5", 0.08),
          color: "primary.main",
          borderRight: "4px solid",
          borderColor: "primary.main",
          "& .RaMenuItemLink-icon": {
            color: "primary.main",
          },
        },
      },
      "& .RaMenuItemLink-icon": {
        minWidth: 40,
        fontSize: "1.2rem",
      },
    }}
  />
);

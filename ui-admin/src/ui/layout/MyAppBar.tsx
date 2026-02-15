// src/ui/layout/MyAppBar.tsx
import { AppBar, TitlePortal } from "react-admin";
import { Box, Typography } from "@mui/material";

export const MyAppBar = () => (
  <AppBar
    sx={{
      backgroundColor: "#ffffff",
      color: "#0f172a",
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      borderBottom: "2px solid #f1f5f9",
    }}
  >
    <Box flex="1" display="flex" alignItems="center">
      <Box
        sx={{
          width: 32,
          height: 32,
          backgroundColor: "primary.main",
          borderRadius: 1,
          mr: 2,
        }}
      />
      <Typography
        variant="h6"
        sx={{ fontWeight: 900, textTransform: "uppercase", letterSpacing: 1 }}
      >
        Gestão de Fila
      </Typography>
    </Box>
    <TitlePortal />
  </AppBar>
);

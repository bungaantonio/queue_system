// src/ui/layout/MyAppBar.tsx
import { AppBar, TitlePortal, UserMenu } from "react-admin";
import { Box, Typography } from "@mui/material";

export const MyAppBar = () => (
  <AppBar userMenu={<UserMenu />} elevation={0}>
    <Box sx={{ display: "flex", alignItems: "center", flex: 1, gap: 1.5 }}>
      {/* Marca — substitua pelo seu logótipo */}
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: "7px",
          background: "linear-gradient(135deg, #4338ca 0%, #6366f1 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Typography sx={{ color: "white", fontSize: "0.75rem", fontWeight: 800, lineHeight: 1 }}>
          A
        </Typography>
      </Box>
      <TitlePortal />
    </Box>
  </AppBar>
);
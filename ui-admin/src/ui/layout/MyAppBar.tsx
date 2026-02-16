// src/ui/layout/MyAppBar.tsx
import { AppBar, TitlePortal, UserMenu } from "react-admin";
import { Box } from "@mui/material";

export const MyAppBar = () => (
  <AppBar userMenu={<UserMenu />} elevation={0}>
    <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
      <TitlePortal />
    </Box>
  </AppBar>
);

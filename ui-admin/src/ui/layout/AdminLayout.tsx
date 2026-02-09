// src/ui/AdminLayout.tsx
import { Layout, AppBar, UserMenu, Sidebar, Menu } from "react-admin";
import { Box, Typography } from "@mui/material";

const MyAppBar = (props: any) => (
  <AppBar {...props} userMenu={<UserMenu />}>
    <Box display="flex" alignItems="center" gap={2} flex={1}>
      <Box
        sx={{
          width: 40,
          height: 40,
          background: "linear-gradient(135deg, #0EA5E9, #F59E0B)",
          borderRadius: "14px",
          rotate: "-10deg",
        }}
      />
      <Typography
        variant="h5"
        sx={{ fontWeight: 900, tracking: "-0.05em", color: "#0F172A" }}
      >
        CORE<span style={{ color: "#0EA5E9" }}>ADMIN</span>
      </Typography>
    </Box>
  </AppBar>
);

const MySidebar = (props: any) => (
  <Sidebar
    {...props}
    sx={{
      "& .RaSidebar-fixed": { mt: 4 },
      "& .MuiMenuItem-root": { borderRadius: 4, mb: 0.5, fontWeight: 700 },
    }}
  />
);

export const AdminLayout = (props: any) => (
  <Layout
    {...props}
    appBar={MyAppBar}
    sidebar={MySidebar}
    sx={{
      "& .RaLayout-content": {
        mt: 4,
        px: 6,
        backgroundColor: "#F1F5F9",
        minHeight: "100vh",
      },
    }}
  />
);

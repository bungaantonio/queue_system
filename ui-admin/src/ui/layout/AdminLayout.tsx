// src/ui/layout/AdminLayout.tsx
import { Layout, AppBar, UserMenu, Sidebar } from "react-admin";
import { Box, Typography, alpha } from "@mui/material";

const MyAppBar = () => (
  <AppBar
    userMenu={<UserMenu />}
    sx={{
      backgroundColor: alpha("#FFFFFF", 0.8),
      backdropFilter: "blur(12px)",
      color: "#0F172A",
      boxShadow: "none",
      borderBottom: "1px solid",
      borderColor: "divider",
      height: 70,
      justifyContent: "center",
      zIndex: (theme) => theme.zIndex.drawer + 1,
    }}
  >
    <Box display="flex" alignItems="center" gap={2} flex={1}>
      {/* Logo Icon */}
      <Box
        sx={{
          width: 38,
          height: 38,
          background: "linear-gradient(135deg, #0EA5E9 0%, #F59E0B 100%)",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(14, 165, 233, 0.3)",
          transform: "rotate(-5deg)",
        }}
      >
        <Typography
          sx={{ color: "white", fontWeight: 900, fontSize: "1.2rem" }}
        >
          Q
        </Typography>
      </Box>

      <Typography
        variant="h5"
        sx={{
          fontWeight: 900,
          letterSpacing: "-0.05em",
          color: "#0F172A",
          display: { xs: "none", sm: "block" },
        }}
      >
        CORE<span style={{ color: "#0EA5E9" }}>QUEUE</span>
      </Typography>
    </Box>
  </AppBar>
);

const MySidebar = (props: any) => (
  <Sidebar
    {...props}
    sx={{
      backgroundColor: "#F1F5F9",
      "& .RaSidebar-fixed": {
        backgroundColor: "transparent",
        marginTop: "80px", // Espaço para a AppBar
        padding: "0 12px",
      },
      "& .MuiMenuItem-root": {
        borderRadius: "12px",
        mb: 1,
        fontWeight: 600,
        color: "#64748B",
        "&.RaMenuItem-active": {
          backgroundColor: "#FFFFFF",
          color: "#0EA5E9",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          "& .MuiSvgIcon-root": {
            color: "#0EA5E9",
          },
        },
      },
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
        backgroundColor: "#F1F5F9",
        padding: { xs: 2, md: 4 },
        marginTop: "70px", // Altura da AppBar
        minHeight: "calc(100vh - 70px)",
        borderRadius: { md: "24px 0 0 0" }, // Efeito de painel sobreposto
        borderLeft: { md: "1px solid rgba(0,0,0,0.05)" },
        boxShadow: "-10px 0 20px -10px rgba(0,0,0,0.05)",
      },
    }}
  />
);

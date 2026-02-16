// src/ui/layout/MyAppBar.tsx
import { AppBar, TitlePortal, UserMenu, LoadingIndicator } from "react-admin";
import { Box, Typography, alpha, Stack } from "@mui/material";
import { LayoutDashboard } from "lucide-react"; // Usando Lucide para clareza

export const MyAppBar = () => (
  <AppBar
    sx={{
      backgroundColor: alpha("#ffffff", 0.84),
      backdropFilter: "blur(12px) saturate(180%)",
      color: "text.primary",
      boxShadow: "none",
      borderBottom: "1px solid",
      borderColor: "divider",
      height: 62,
      display: "flex",
      justifyContent: "center",
      zIndex: (theme) => theme.zIndex.drawer + 1,
    }}
    userMenu={<UserMenu />}
  >
    <Box flex="1" display="flex" alignItems="center" px={1.5}>
      {/* Branding Técnico: QMS. */}
      <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mr: 2.5 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            bgcolor: "primary.main",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: (theme) =>
              `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
          }}
        >
          <LayoutDashboard size={18} color="white" strokeWidth={3} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 900,
            fontSize: "1.05rem",
            letterSpacing: "-0.03em",
            color: "text.primary",
          }}
        >
          QMS<span style={{ color: "var(--fcc-flow)" }}>.</span>
        </Typography>
      </Stack>

      {/* Título da Página Dinâmico */}
      <TitlePortal
        sx={{
          "& .RaTitle-root": {
            fontWeight: 700,
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "text.secondary",
            px: 1.2,
            py: 0.5,
            borderRadius: 2,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
          },
        }}
      />

      <Box flex={1} />

      <Stack direction="row" spacing={1} alignItems="center">
        <LoadingIndicator
          sx={{
            "& .RaLoadingIndicator-loader": { color: "primary.main" },
          }}
        />
        {/* Aqui o MUI cuida do UserMenu automaticamente */}
      </Stack>
    </Box>
  </AppBar>
);

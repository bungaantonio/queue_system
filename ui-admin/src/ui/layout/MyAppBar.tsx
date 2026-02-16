// src/ui/layout/MyAppBar.tsx
import { useEffect, useState } from "react";
import { AppBar, LoadingIndicator, TitlePortal, UserMenu } from "react-admin";
import { Box, Chip, Stack, Typography, alpha } from "@mui/material";
import { Activity, LayoutDashboard, ShieldCheck } from "lucide-react";

const HeaderClock = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Typography
      variant="caption"
      sx={{
        fontWeight: 800,
        color: "text.secondary",
        letterSpacing: "0.08em",
      }}
    >
      {new Intl.DateTimeFormat("pt-PT", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(now)}
    </Typography>
  );
};

export const MyAppBar = () => (
  <AppBar
    userMenu={<UserMenu />}
    sx={{
      height: 56,
      color: "text.primary",
      background:
        "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(248,250,252,0.94) 100%)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid",
      borderColor: "divider",
      boxShadow: "0 8px 20px rgba(15,23,42,0.06)",
      "& .RaAppBar-toolbar": {
        minHeight: "56px !important",
        px: 1.25,
        gap: 1.25,
      },
      "& .RaAppBar-menuButton": {
        color: "primary.main",
        border: "1px solid",
        borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
        backgroundColor: "background.paper",
        borderRadius: 2,
        p: 0.7,
        zIndex: 5,
        position: "relative",
        "&:hover": {
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
        },
      },
    }}
  >
    <Stack direction="row" spacing={1} alignItems="center">
      <Box
        sx={{
          width: 26,
          height: 26,
          borderRadius: 1.5,
          background:
            "linear-gradient(180deg, rgba(79,70,229,1) 0%, rgba(55,48,163,1) 100%)",
          color: "white",
          display: "grid",
          placeItems: "center",
          boxShadow: "0 6px 14px rgba(79,70,229,0.28)",
        }}
      >
        <LayoutDashboard size={16} />
      </Box>
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 900,
          letterSpacing: "0.1em",
          color: "text.primary",
        }}
      >
        FLUID COMMAND CENTER
      </Typography>
    </Stack>

    <Box sx={{ minWidth: 0 }}>
      <TitlePortal
        sx={{
          "& .RaTitle-root": {
            fontWeight: 800,
            fontSize: "0.66rem",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "primary.main",
            px: 1,
            py: 0.35,
            borderRadius: 2,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
            border: "1px solid",
            borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: { xs: 120, md: 240 },
          },
        }}
      />
    </Box>

    <Box flex={1} />

    <Stack direction="row" spacing={0.75} alignItems="center">
      <Chip
        size="small"
        icon={<Activity size={12} />}
        label="Ativo"
        sx={{
          height: 20,
          color: "success.dark",
          border: "1px solid",
          borderColor: (theme) => alpha(theme.palette.success.main, 0.35),
          bgcolor: (theme) => alpha(theme.palette.success.main, 0.12),
          "& .MuiChip-label": {
            px: 0.75,
            fontSize: "0.62rem",
            fontWeight: 900,
            letterSpacing: "0.08em",
          },
          "& .MuiChip-icon": { color: "success.main" },
        }}
      />
      <Chip
        size="small"
        icon={<ShieldCheck size={12} />}
        label="Íntegro"
        sx={{
          height: 20,
          color: "text.secondary",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          "& .MuiChip-label": {
            px: 0.75,
            fontSize: "0.62rem",
            fontWeight: 900,
            letterSpacing: "0.08em",
          },
          "& .MuiChip-icon": { color: "primary.main" },
        }}
      />
      <HeaderClock />
      <LoadingIndicator
        sx={{
          "& .RaLoadingIndicator-loader": { color: "primary.main" },
        }}
      />
    </Stack>
  </AppBar>
);

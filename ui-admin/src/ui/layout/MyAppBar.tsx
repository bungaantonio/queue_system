// src/ui/layout/MyAppBar.tsx
import { AppBar, TitlePortal, UserMenu } from "react-admin";
import { Box, Typography, alpha } from "@mui/material";
import { Sparkles } from "lucide-react";
import { useConnectionStatus } from "../connection/connectionEvents";

export const MyAppBar = () => {
  const { isOnline, serverUnavailable, sseConnected } = useConnectionStatus();
  const showServerOffline = !isOnline || serverUnavailable;
  const showSseDown = !showServerOffline && !sseConnected;

  return (
    <AppBar userMenu={<UserMenu />} elevation={0}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flex: 1,
          gap: 1.5,
          minHeight: 56,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            py: 0.5,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #4338ca 0%, #6366f1 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: (theme) =>
                `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

              "&:hover": {
                transform: "scale(1.05) rotate(2deg)",
                boxShadow: (theme) =>
                  `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
              },
            }}
          >
            <Sparkles size={18} color="#ffffff" strokeWidth={2.5} />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: 800,
                lineHeight: 1,
                color: "primary.main",
                letterSpacing: "0.5px",
              }}
            >
              QMS
            </Typography>
            <Typography
              sx={{
                fontSize: "0.65rem",
                fontWeight: 600,
                lineHeight: 1,
                color: "text.secondary",
                letterSpacing: "0.3px",
              }}
            >
              Admin
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
          <TitlePortal />
        </Box>
      </Box>

      {showServerOffline || showSseDown ? (
        <Box
          sx={{
            mt: 0.75,
            mb: 1,
            px: 1.5,
            py: 0.75,
            borderRadius: 1.5,
            bgcolor: showServerOffline ? "error.light" : "warning.light",
            color: showServerOffline ? "error.contrastText" : "warning.dark",
            border: "1px solid",
            borderColor: showServerOffline ? "error.main" : "warning.main",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.6px",
          }}
        >
          {showServerOffline
            ? "Servidor indisponível"
            : "Tempo real indisponível (SSE)"}
        </Box>
      ) : null}
    </AppBar>
  );
};

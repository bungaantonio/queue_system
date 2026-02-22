// src/modules/queue/components/StatusHero.tsx
import { Box, Typography, Stack, alpha } from "@mui/material";

interface StatusHeroProps {
  user: { position: number; name: string; ticket?: string } | null;
  isPending: boolean;
}

export const StatusHero = ({ user, isPending }: StatusHeroProps) => {
  const isIdle = !user;

  // Idle — sem utente chamado
  if (isIdle) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: "text.disabled" }}
        >
          Sem utentes em atendimento
        </Typography>
      </Box>
    );
  }

  // Chamado, aguarda validação biométrica
  if (isPending) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 1,
        }}
      >
        <Typography
          variant="overline"
          sx={{
            fontWeight: 900,
            letterSpacing: 4,
            color: (theme) => alpha(theme.palette.common.white, 0.6),
          }}
        >
          A aguardar validação
        </Typography>
        {user.ticket && (
          <Typography
            sx={{
              fontSize: { xs: "3.5rem", md: "5.5rem" },
              fontWeight: 900,
              lineHeight: 0.85,
              letterSpacing: -4,
              color: "white",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {user.ticket}
          </Typography>
        )}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: (theme) => alpha(theme.palette.common.white, 0.9),
            letterSpacing: -0.5,
          }}
        >
          {user.name}
        </Typography>
      </Box>
    );
  }

  // Autenticado — em atendimento real
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 1,
      }}
    >
      <Stack alignItems="center" spacing={0.25}>
        <Typography
          sx={{
            fontSize: { xs: "4.5rem", md: "7rem" },
            fontWeight: 900,
            lineHeight: 0.8,
            letterSpacing: -6,
            color: "text.primary",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {user.ticket}
        </Typography>
      </Stack>
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, color: "text.secondary", letterSpacing: -0.5 }}
      >
        {user.name}
      </Typography>
    </Box>
  );
};

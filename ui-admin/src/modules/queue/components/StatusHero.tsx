// src/modules/queue/components/console/StatusHero.tsx
import { Box, Typography, Stack, alpha } from "@mui/material";

interface StatusHeroProps {
  user: { position: number; name: string; ticket?: string } | null;
  isPending: boolean;
}

export const StatusHero = ({ user, isPending }: StatusHeroProps) => {
  const isIdle = !user;
  const headline = isIdle
    ? "DISPONÍVEL"
    : isPending
      ? "VALIDAÇÃO NECESSÁRIA"
      : "UTENTE EM ATENDIMENTO";

  const subline = isIdle
    ? "Aguardando próxima chamada"
    : isPending
      ? "Confirme a presença para iniciar atendimento"
      : user?.name || "Atendimento em curso";

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
      }}
    >
      {isPending ? (
        <Stack spacing={1} alignItems="center">
          {user?.ticket ? (
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "3.6rem", md: "5rem" },
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: -4,
                color: "white",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {user.ticket}
            </Typography>
          ) : null}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: (theme) => alpha(theme.palette.common.white, 0.95),
              letterSpacing: -0.5,
              fontSize: { xs: "1.3rem", md: "1.7rem" },
              maxWidth: "85%",
            }}
          >
            {user?.name || "Utente em chamada"}
          </Typography>
        </Stack>
      ) : (
        <Stack spacing={isIdle ? 2 : 0} alignItems="center">
          <Typography
            variant="overline"
            sx={{
              fontWeight: 900,
              letterSpacing: 4,
              color: "primary.main",
              mb: 1,
            }}
          >
            {headline}
          </Typography>

          <Stack spacing={0.3} alignItems="center">
            <Typography
              variant="h1"
              sx={{
                fontSize: isIdle
                  ? { xs: "2.8rem", md: "4rem" }
                  : { xs: "4.4rem", md: "6.6rem" },
                fontWeight: 900,
                lineHeight: 0.8,
                letterSpacing: -5,
                color: "text.primary",
                mb: 0.1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {typeof user?.position === "number" ? user.position : "FREE"}
            </Typography>
            {!isIdle && user?.ticket ? (
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "monospace",
                  fontSize: "0.78rem",
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  color: "primary.main",
                }}
              >
                TICKET {user.ticket}
              </Typography>
            ) : null}
          </Stack>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "text.secondary",
              maxWidth: "85%",
              letterSpacing: -0.5,
              fontSize: { xs: "1.1rem", md: "1.5rem" },
            }}
          >
            {subline}
          </Typography>
        </Stack>
      )}
    </Box>
  );
};

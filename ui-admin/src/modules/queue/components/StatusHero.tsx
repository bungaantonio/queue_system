// src/modules/queue/components/console/StatusHero.tsx
import { Box, Typography, Stack, alpha, keyframes } from "@mui/material";
import { BellRing } from "lucide-react";

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

interface StatusHeroProps {
  user: { position: string; name: string } | null;
  isPending: boolean;
}

export const StatusHero = ({ user, isPending }: StatusHeroProps) => {
  const isIdle = !user;

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
      {isPending && (
        <Box
          sx={{
            position: "absolute",
            top: -12,
            animation: `${pulse} 2s infinite ease-in-out`,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <BellRing size={24} color="#ffffff" />
          <Typography
            variant="caption"
            sx={{ color: "white", fontWeight: 900, letterSpacing: 2 }}
          >
            A CHAMAR NO DISPLAY...
          </Typography>
        </Box>
      )}

      <Stack spacing={isIdle ? 2 : 0} alignItems="center">
        <Typography
          variant="overline"
          sx={{
            fontWeight: 900,
            letterSpacing: 4,
            color: isPending ? alpha("#fff", 0.7) : "primary.main",
            mb: 1,
          }}
        >
          {isIdle
            ? "BALCÃO DISPONÍVEL"
            : isPending
              ? "VALIDAÇÃO NECESSÁRIA"
              : "UTENTE EM ATENDIMENTO"}
        </Typography>

        <Typography
          variant="h1"
          sx={{
            fontSize: isIdle
              ? { xs: "2.8rem", md: "4rem" }
              : { xs: "4.4rem", md: "6.6rem" },
            fontWeight: 900,
            lineHeight: 0.8,
            letterSpacing: -5,
            color: isPending ? "white" : "text.primary",
            mb: 1.25,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {user?.position || "FREE"}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: isPending ? alpha("#fff", 0.9) : "text.secondary",
            maxWidth: "85%",
            letterSpacing: -0.5,
            fontSize: { xs: "1.1rem", md: "1.5rem" },
          }}
        >
          {user?.name || "Aguardando próxima chamada"}
        </Typography>
      </Stack>
    </Box>
  );
};

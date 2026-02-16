// src/modules/shared/components/SessionExpiredPage.tsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export const SessionExpiredPage: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: "calc(100dvh - 70px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: 400 },
          textAlign: "center",
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "8rem", sm: "10rem" },
            fontWeight: 800,
            letterSpacing: "-0.5rem",
            lineHeight: 1,
            mb: 2,
            "& .highlight": { color: "warning.main" },
          }}
        >
          <span>4</span>
          <span>4</span>
          <span className="highlight">0</span>
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem" },
            fontWeight: 700,
            color: "primary.main",
            mb: 2,
          }}
        >
          Sessão expirada
        </Typography>

        {/* Texto explicativo */}
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "0.875rem", sm: "1rem" },
            color: "text.secondary",
            mb: 4,
            maxWidth: 350,
            mx: "auto",
            lineHeight: 1.5,
          }}
        >
          A sua sessão terminou por motivos de segurança. Para continuar, por
          favor,
          <Button
            component={Link}
            to="/"
            variant="text"
            sx={{
              textTransform: "none",
              fontWeight: 700,
              color: "primary.main",
              p: 0,
              ml: 0.5,
            }}
          >
            autentique-se novamente
          </Button>
          .
        </Typography>
      </Box>
    </Box>
  );
};

// src/modules/shared/components/NotAuthorizedPage.tsx
import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { useRedirect } from 'react-admin';
import { Link } from "react-router-dom";

export const NotAuthorizedPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: theme.palette.mode === "dark" ? "#121212" : "#f5f5f5",
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
            "& .broken": { color: "#ff4c4c" },
          }}
        >
          <span>4</span>
          <span>0</span>
          <span className="broken">3</span>
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem" },
            fontWeight: 700,
            color: "#1177bd",
            mb: 2,
          }}
        >
          Acesso Negado!
        </Typography>

        {/* Texto explicativo */}
        <Typography variant="body1">
          Não tem acesso a esta área da aplicação.
          Pode voltar à{' '}
          <Button
            component={Link} 
            to="/"           
            variant="text"
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              color: '#1177bd',
              p: 0,
              ml: 0.5,
            }}
          >
            página Dashboard
          </Button>
          .
        </Typography>
      </Box>
    </Box>
  );
};

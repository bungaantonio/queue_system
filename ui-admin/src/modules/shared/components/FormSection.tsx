// src/modules/shared/components/FormSection.tsx
import type { ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material/styles";
import { Paper, Stack, Box, Typography, alpha, useTheme } from "@mui/material";

type Tone = "primary" | "secondary" | "success";

interface FormSectionProps {
  title: string;
  description: string;
  children: ReactNode;
  tone?: Tone;
  step?: number;
  sx?: SxProps<Theme>;
}

export const FormSection = ({
  title,
  description,
  children,
  tone = "primary",
  step,
  sx,
}: FormSectionProps) => {
  const theme = useTheme();

  const toneColor =
    tone === "secondary"
      ? theme.palette.secondary.main
      : tone === "success"
        ? theme.palette.success.main
        : theme.palette.primary.main;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 2.5 },
        borderRadius: 2,
        border: "1px solid",
        borderColor: alpha(toneColor, 0.25),
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(toneColor, 0.06)} 100%)`,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "4px",
          bgcolor: toneColor,
        },
        ...sx,
      }}
    >
      {/* Cabeçalho da secção */}
      <Stack
        direction="row"
        alignItems="flex-start"
        spacing={1.5}
        sx={{ mb: 2 }}
      >
        {step !== undefined && (
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "8px",
              bgcolor: alpha(toneColor, 0.12),
              color: toneColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.7rem",
              fontWeight: 900,
              flexShrink: 0,
              mt: 0.25,
              letterSpacing: 0,
            }}
          >
            {step}
          </Box>
        )}

        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {description}
          </Typography>
          <Box
            sx={{
              mt: 0.75,
              width: 32,
              height: 3,
              bgcolor: toneColor,
              borderRadius: 1,
            }}
          />
        </Box>
      </Stack>

      <Stack spacing={2}>{children}</Stack>
    </Paper>
  );
};

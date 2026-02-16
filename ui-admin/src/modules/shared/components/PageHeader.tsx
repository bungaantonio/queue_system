import { Box, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  mb?: number;
}

export const PageHeader = ({
  title,
  description,
  icon,
  actions,
  mb = 2,
}: PageHeaderProps) => (
  <Stack
    direction={{ xs: "column", lg: "row" }}
    justifyContent="space-between"
    alignItems={{ xs: "flex-start", lg: "center" }}
    gap={1.25}
    sx={{ mb }}
  >
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1.5}
      alignItems={{ xs: "flex-start", sm: "center" }}
    >
      {icon ? (
        <Box
          sx={{
            p: 1.25,
            bgcolor: "primary.main",
            borderRadius: 2.5,
            color: "common.white",
            display: "grid",
            placeItems: "center",
          }}
        >
          {icon}
        </Box>
      ) : null}
      <Box>
        <Typography variant="h4">{title}</Typography>
        {description ? (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        ) : null}
      </Box>
    </Stack>

    {actions ? actions : null}
  </Stack>
);

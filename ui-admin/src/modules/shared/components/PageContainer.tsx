import { Box } from "@mui/material";
import type { ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material/styles";

interface PageContainerProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

export const PageContainer = ({ children, sx }: PageContainerProps) => (
  <Box
    sx={{
      px: { xs: 2, md: 3 },
      py: { xs: 2, md: 3 },
      width: "100%",
      ...sx,
    }}
  >
    {children}
  </Box>
);

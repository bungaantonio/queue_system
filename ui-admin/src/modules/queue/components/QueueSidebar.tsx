// src/modules/queue/components/console/QueueSidebar.tsx
import {
  Box,
  Typography,
  Stack,
  Paper,
  IconButton,
  alpha,
} from "@mui/material";
import { Trash2, UserPlus } from "lucide-react";

export const QueueSidebar = ({ queue, onCancel }: any) => {
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1.5, px: 0.5 }}
      >
        <Typography
          variant="subtitle2"
          sx={{ color: "text.secondary", fontWeight: 800 }}
        >
          PRÓXIMOS NA FILA ({queue.length})
        </Typography>
        <UserPlus size={16} color="var(--fcc-stable)" />
      </Stack>

      <Stack spacing={1} sx={{ overflowY: "auto", flex: 1, pr: 0.5 }}>
        {queue.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center", opacity: 0.5 }}>
            <Typography variant="caption" fontWeight={700}>
              FILA VAZIA
            </Typography>
          </Box>
        ) : (
          queue.map((item: any, index: number) => (
            <Paper
              key={item.id}
              elevation={0}
              sx={{
                p: 1.5,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid",
                borderColor: index === 0 ? "primary.light" : "divider",
                bgcolor:
                  index === 0
                    ? (theme) => alpha(theme.palette.primary.main, 0.04)
                    : "background.paper",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateX(4px)",
                  boxShadow: (theme) =>
                    `0 8px 18px ${alpha(theme.palette.primary.main, 0.12)}`,
                },
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 900,
                    color: index === 0 ? "primary.main" : "text.disabled",
                    minWidth: 48,
                  }}
                >
                  {item.position}
                </Typography>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, lineHeight: 1.2 }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      textTransform: "uppercase",
                      fontSize: "0.6rem",
                      fontWeight: 800,
                    }}
                  >
                    Prioritário
                  </Typography>
                </Box>
              </Stack>
              <IconButton
                size="small"
                onClick={() => onCancel(item.id)}
                sx={{
                  opacity: 0.2,
                  "&:hover": { opacity: 1, color: "error.main" },
                }}
              >
                <Trash2 size={14} />
              </IconButton>
            </Paper>
          ))
        )}
      </Stack>
    </Box>
  );
};

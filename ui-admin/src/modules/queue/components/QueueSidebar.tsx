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
        sx={{ mb: 3, px: 1 }}
      >
        <Typography
          variant="subtitle2"
          sx={{ color: "text.secondary", fontWeight: 800 }}
        >
          PRÓXIMOS NA FILA ({queue.length})
        </Typography>
        <UserPlus size={16} color="#64748b" />
      </Stack>

      <Stack spacing={1.5} sx={{ overflowY: "auto", flex: 1, pr: 1 }}>
        {queue.length === 0 ? (
          <Box sx={{ py: 10, textAlign: "center", opacity: 0.5 }}>
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
                p: 2,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid",
                borderColor: index === 0 ? "primary.light" : "divider",
                bgcolor:
                  index === 0 ? alpha("#4f46e5", 0.03) : "background.paper",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateX(4px)" },
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 900,
                    color: index === 0 ? "primary.main" : "text.disabled",
                    minWidth: 60,
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

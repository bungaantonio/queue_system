// src/modules/queue/components/QueueSidebar.tsx
import {
  Box,
  Typography,
  Stack,
  Paper,
  Chip,
  IconButton,
  alpha,
  useTheme,
} from "@mui/material";
import { Users, Trash2 } from "lucide-react";
import type { QueueEntry } from "../atendimento.types";

const VISIBLE = 6;

const priorityMap = {
  urgent: { label: "URGENTE", color: "error" },
  priority: { label: "PRIORIT.", color: "warning" },
  normal: { label: "NORMAL", color: "default" },
} as const;

export const QueueSidebar = ({
  queue,
  onCancel,
}: {
  queue: QueueEntry[];
  onCancel: (id: number) => void | Promise<void>;
}) => {
  const theme = useTheme();
  const visible = queue.slice(0, VISIBLE);
  const remaining = Math.max(queue.length - VISIBLE, 0);

  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        border: "1px solid",
        borderColor: alpha(theme.palette.divider, 0.8),
        overflow: "hidden",
      }}
    >
      {/* Cabeçalho integrado */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: "1px solid",
          borderColor: alpha(theme.palette.divider, 0.6),
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: 1.5,
              display: "grid",
              placeItems: "center",
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
            }}
          >
            <Users size={15} />
          </Box>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 800, lineHeight: 1.2 }}
            >
              Fila operacional
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {queue.length} em espera
            </Typography>
          </Box>
        </Stack>

        {remaining > 0 && (
          <Chip
            size="small"
            label={`+${remaining}`}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 800, fontSize: "0.7rem", height: 22 }}
          />
        )}
      </Box>

      {/* Lista */}
      <Stack spacing={0} sx={{ flex: 1, overflowY: "auto", p: 1 }}>
        {queue.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 6,
            }}
          >
            <Typography
              variant="caption"
              fontWeight={800}
              color="text.disabled"
            >
              SEM UTENTES NA FILA
            </Typography>
          </Box>
        ) : (
          visible.map((item, index) => {
            const isNext = index === 0;
            const priority =
              priorityMap[item.attendanceType as keyof typeof priorityMap] ??
              priorityMap.normal;

            return (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 1.25,
                  py: 1.1,
                  borderRadius: 1.5,
                  position: "relative",
                  transition: "background 0.15s ease",
                  bgcolor: isNext
                    ? alpha(theme.palette.primary.main, 0.06)
                    : "transparent",
                  borderLeft: "3px solid",
                  borderLeftColor: isNext
                    ? theme.palette.primary.main
                    : "transparent",
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                    "& .cancel-btn": { opacity: 1 },
                  },
                }}
              >
                {/* Nome + ticket + prioridade */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isNext ? 800 : 600,
                      color: isNext ? "text.primary" : "text.secondary",
                      lineHeight: 1.3,
                    }}
                    noWrap
                  >
                    {item.name}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                    sx={{ mt: 0.4 }}
                  >
                    {item.ticket && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: "monospace",
                          fontWeight: 900,
                          fontSize: "0.65rem",
                          color: "primary.main",
                          letterSpacing: "0.05em",
                        }}
                      >
                        #{item.ticket}
                      </Typography>
                    )}
                    <Chip
                      size="small"
                      label={priority.label}
                      color={priority.color}
                      variant={
                        priority.color === "default" ? "outlined" : "filled"
                      }
                      sx={{
                        height: 16,
                        "& .MuiChip-label": {
                          px: 0.6,
                          fontSize: "0.55rem",
                          fontWeight: 900,
                          letterSpacing: "0.06em",
                        },
                      }}
                    />
                    {isNext && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "0.6rem",
                          fontWeight: 900,
                          color: "primary.main",
                          letterSpacing: "0.08em",
                        }}
                      >
                        PRÓXIMO
                      </Typography>
                    )}
                  </Stack>
                </Box>

                {/* Cancelar — só aparece no hover */}
                <IconButton
                  className="cancel-btn"
                  size="small"
                  onClick={() => onCancel(item.id)}
                  aria-label={`Cancelar ${item.name}`}
                  sx={{
                    opacity: 0,
                    transition: "opacity 0.15s ease",
                    color: "text.disabled",
                    "&:hover": { color: "error.main" },
                  }}
                >
                  <Trash2 size={13} />
                </IconButton>
              </Box>
            );
          })
        )}
      </Stack>
    </Paper>
  );
};

// src/modules/queue/components/QueueSidebar.tsx
import {
  Box,
  Typography,
  Stack,
  Paper,
  IconButton,
  alpha,
  Chip,
} from "@mui/material";
import { Trash2, UserPlus } from "lucide-react";
import type { QueueEntry } from "../atendimento.types";

export const QueueSidebar = ({
  queue,
  onCancel,
}: {
  queue: QueueEntry[];
  onCancel: (id: number) => void | Promise<void>;
}) => {
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1.25, px: 0.5 }}
      >
        <Stack spacing={0.2}>
          <Typography
            variant="subtitle2"
            sx={{ color: "text.secondary", fontWeight: 900 }}
          >
            FILA OPERACIONAL
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {queue.length} utente(s) em espera
          </Typography>
        </Stack>
        <UserPlus size={16} color="var(--fcc-stable)" />
      </Stack>

      <Stack spacing={0.9} sx={{ overflowY: "auto", flex: 1, pr: 0.5 }}>
        {queue.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              py: 4,
              px: 2,
              textAlign: "center",
              borderRadius: 3,
              bgcolor: "background.paper",
            }}
          >
            <Typography
              variant="caption"
              fontWeight={800}
              color="text.secondary"
            >
              SEM UTENTES NA FILA
            </Typography>
          </Paper>
        ) : (
          queue.map((item, index) => {
            const isNext = index === 0;
            const priorityLabel =
              item.attendanceType === "urgent"
                ? "Urgente"
                : item.attendanceType === "priority"
                  ? "Prioritário"
                  : "Normal";
            const priorityColor =
              item.attendanceType === "urgent"
                ? "error"
                : item.attendanceType === "priority"
                  ? "warning"
                  : "default";
            return (
              <Paper
                key={item.id}
                elevation={0}
                sx={{
                  p: 1.25,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid",
                  borderColor: isNext ? "primary.light" : "divider",
                  bgcolor: isNext
                    ? (theme) => alpha(theme.palette.primary.main, 0.06)
                    : "background.paper",
                  transition: "box-shadow 0.16s ease, border-color 0.16s ease",
                  "&:hover": {
                    borderColor: isNext ? "primary.main" : "primary.light",
                    boxShadow: (theme) =>
                      `0 6px 14px ${alpha(theme.palette.primary.main, 0.12)}`,
                  },
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.2}
                  alignItems="center"
                  sx={{ minWidth: 0 }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 900,
                      color: isNext ? "primary.main" : "text.disabled",
                      minWidth: 44,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {item.position}
                  </Typography>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, lineHeight: 1.2 }}
                      noWrap
                    >
                      {item.name}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={0.6}
                      alignItems="center"
                      sx={{ mt: 0.3 }}
                    >
                      {item.ticket ? (
                        <Chip
                          size="small"
                          label={`#${item.ticket}`}
                          color="primary"
                          variant="outlined"
                          sx={{
                            height: 18,
                            "& .MuiChip-label": {
                              px: 0.7,
                              fontSize: "0.56rem",
                              fontWeight: 900,
                              fontFamily: "monospace",
                            },
                          }}
                        />
                      ) : null}
                      <Chip
                        size="small"
                        label={priorityLabel.toUpperCase()}
                        color={priorityColor}
                        variant={
                          priorityColor === "default" ? "outlined" : "filled"
                        }
                        sx={{
                          height: 18,
                          "& .MuiChip-label": {
                            px: 0.7,
                            fontSize: "0.56rem",
                            fontWeight: 900,
                            letterSpacing: "0.08em",
                          },
                        }}
                      />
                      {isNext ? (
                        <Chip
                          size="small"
                          label="PRÓXIMO"
                          color="primary"
                          sx={{
                            height: 18,
                            "& .MuiChip-label": {
                              px: 0.7,
                              fontSize: "0.58rem",
                              fontWeight: 900,
                              letterSpacing: "0.08em",
                            },
                          }}
                        />
                      ) : (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            fontSize: "0.58rem",
                            fontWeight: 800,
                          }}
                        >
                          Em espera
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                </Stack>

                <IconButton
                  size="small"
                  onClick={() => onCancel(item.id)}
                  sx={{
                    opacity: 0.28,
                    "&:hover": { opacity: 1, color: "error.main" },
                  }}
                  aria-label={`Cancelar ${item.name}`}
                >
                  <Trash2 size={14} />
                </IconButton>
              </Paper>
            );
          })
        )}
      </Stack>
    </Box>
  );
};

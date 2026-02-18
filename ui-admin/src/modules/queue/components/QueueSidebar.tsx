// src/modules/queue/components/QueueSidebar.tsx
import {
  Box,
  Typography,
  Stack,
  Paper,
  IconButton,
  alpha,
  Chip,
  useTheme,
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
  const theme = useTheme();
  const maxVisible = 6;
  const visibleQueue = queue.slice(0, maxVisible);
  const remainingCount = Math.max(queue.length - visibleQueue.length, 0);

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Paper
        elevation={0}
        sx={{
          mb: 1.2,
          px: 1.5,
          py: 1.2,
          borderRadius: 2,
          border: "1px solid",
          borderColor: alpha(theme.palette.divider, 0.8),
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(
            theme.palette.background.default,
            0.6,
          )} 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Stack spacing={0.2}>
          <Typography
            variant="subtitle2"
            sx={{ color: "text.secondary", fontWeight: 900, letterSpacing: 1 }}
          >
            FILA OPERACIONAL
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {queue.length} utente(s) em espera
          </Typography>
        </Stack>
        <Stack spacing={0.4} alignItems="flex-end">
          <Box
            sx={{
              width: 36,
              height: 6,
              borderRadius: 1,
              bgcolor: "primary.main",
            }}
          />
          <Box sx={{ color: "primary.main" }}>
            <UserPlus size={16} />
          </Box>
        </Stack>
      </Paper>

      <Box
        sx={{
          flex: 1,
          borderRadius: 2,
          border: "1px solid",
          borderColor: alpha(theme.palette.divider, 0.8),
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(
            theme.palette.background.default,
            0.5,
          )} 100%)`,
          p: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack
          spacing={0.9}
          sx={{
            overflowY: "auto",
            flex: 1,
            pr: 0.5,
            maxHeight: "100%",
            maskImage:
              "linear-gradient(180deg, rgba(0,0,0,1) 86%, rgba(0,0,0,0.2) 100%)",
          }}
        >
          {queue.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                py: 4,
                px: 2,
                textAlign: "center",
                borderRadius: 2,
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
            visibleQueue.map((item, index) => {
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
                    borderRadius: 2,
                    display: "flex",
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    gap: 1,
                    border: "1px solid",
                    borderColor: isNext
                      ? alpha(theme.palette.primary.main, 0.5)
                      : alpha(theme.palette.divider, 0.9),
                    bgcolor: "background.paper",
                    transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: "3px",
                      bgcolor: isNext
                        ? "primary.main"
                        : alpha(theme.palette.primary.main, 0.2),
                    },
                    "&:hover": {
                      borderColor: "primary.main",
                      boxShadow: (theme) =>
                        `0 10px 20px ${alpha(theme.palette.primary.main, 0.12)}`,
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.2}
                    alignItems="center"
                    sx={{ minWidth: 0 }}
                  >
                    <Box
                      sx={{
                        minWidth: { xs: 34, sm: 44 },
                        height: 36,
                        borderRadius: 1.5,
                        display: "grid",
                        placeItems: "center",
                        bgcolor: isNext
                          ? alpha(theme.palette.primary.main, 0.12)
                          : alpha(theme.palette.primary.main, 0.06),
                        color: isNext ? "primary.main" : "text.disabled",
                        fontWeight: 900,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {item.position}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 700, lineHeight: 1.2 }}
                        noWrap={false}
                      >
                        {item.name}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={0.6}
                        alignItems="center"
                        sx={{ mt: 0.3, flexWrap: "wrap", rowGap: 0.6 }}
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
                      alignSelf: { xs: "flex-start", sm: "center" },
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
        {queue.length > 0 ? (
          <Box
            sx={{
              mt: 1,
              pt: 1,
              borderTop: "1px solid",
              borderColor: alpha(theme.palette.divider, 0.8),
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: 800, color: "text.secondary" }}
            >
              Mostrando {Math.min(queue.length, maxVisible)} de {queue.length}
            </Typography>
            {remainingCount > 0 ? (
              <Chip
                size="small"
                label={`+${remainingCount} restantes`}
                color="primary"
                variant="outlined"
                sx={{
                  height: 22,
                  "& .MuiChip-label": {
                    px: 0.8,
                    fontSize: "0.65rem",
                    fontWeight: 900,
                    letterSpacing: "0.04em",
                  },
                }}
              />
            ) : null}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

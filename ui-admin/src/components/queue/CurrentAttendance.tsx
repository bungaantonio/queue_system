import { useQueue } from "../../queue/QueueContext";
import { QueueActions } from "./QueueActions";
import {
  Paper,
  Typography,
  Box,
  Stack,
  CircularProgress,
  Chip,
  Avatar,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  ATTENDANCE_TYPE_LABELS,
  USER_STATUS_LABELS,
  ATTENDANCE_TYPE_COLOR,
} from "../../queue/labels";

export const CurrentAttendance = () => {
  const { current, loading } = useQueue();

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress size={24} />
      </Box>
    );

  if (!current)
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: "center",
          bgcolor: "background.default",
          border: "2px dashed rgba(0,0,0,0.1)",
        }}
      >
        <Typography color="textSecondary" variant="h6">
          Nenhum usuário em atendimento
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Aguardando chamada...
        </Typography>
      </Paper>
    );

  return (
    <Paper
      elevation={3}
      sx={{
        p: 0,
        overflow: "hidden",
        position: "relative",
        transition: "transform 0.2s",
        "&:hover": { transform: "translateY(-2px)" },
      }}
    >
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          p: 2,
          px: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            opacity: 0.9,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Em Atendimento
        </Typography>
        <Chip
          label={USER_STATUS_LABELS[current.status]}
          size="small"
          sx={{
            bgcolor: "rgba(255,255,255,0.2)",
            color: "white",
            backdropFilter: "blur(4px)",
          }}
        />
      </Box>

      <Box sx={{ p: 4 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "primary.light",
                fontSize: "2rem",
              }}
            >
              {current.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ mb: 0.5 }}>
                {current.name}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip
                  icon={<PersonIcon sx={{ fontSize: 16 }} />}
                  label={ATTENDANCE_TYPE_LABELS[current.attendance_type]}
                  color={ATTENDANCE_TYPE_COLOR[current.attendance_type]}
                  variant={
                    current.attendance_type === "normal" ? "outlined" : "filled"
                  }
                  size="small"
                />
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <AccessTimeIcon
                    sx={{ fontSize: 16, color: "text.secondary" }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {new Date(current.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>

          <Box sx={{ width: { xs: "100%", sm: "auto" }, pt: { xs: 2, sm: 0 } }}>
            <QueueActions userId={current.id} status={current.status} />
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};

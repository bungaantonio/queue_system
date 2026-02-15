// components/charts/waitTime/WaitTimeBar.tsx
import { Box, Typography, Tooltip } from "@mui/material";
import { WAITTIME_CHART_LABELS } from "./labels";

interface Props {
  hour: string;
  time: number;
  min: number;
  max: number;
}

export const WaitTimeBar = ({ hour, time, min, max }: Props) => {
  const heightPercent = ((time - min) / (max - min)) * 100 || 10; // escala real
  const color =
    time <= min + (max - min) / 3
      ? "success.main"
      : time <= min + (2 * (max - min)) / 3
        ? "warning.main"
        : "error.main";

  return (
    <Tooltip title={`${hour}: ${time} min`}>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mx: 0.5,
          height: "100%",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: `${heightPercent}%`,
            bgcolor: color,
            borderRadius: 1,
            transition: "all 0.25s ease-in-out",
          }}
        />
        <Typography variant="caption" sx={{ mt: 0.5 }}>
          {hour}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: "0.65rem" }}
        >
          {time}min
        </Typography>
      </Box>
    </Tooltip>
  );
};

import { Box, Typography } from "@mui/material";
import { VolumeData } from "./types";
import { VOLUME_CHART_LABELS as L } from "./labels";

interface Props {
  data: VolumeData;
}

export const VolumeSummary = ({ data }: Props) => {
  const positive = data.averageTrend >= 0;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {L.summaryTitle}
      </Typography>

      <Typography variant="body1" sx={{ mt: 1 }}>
        {L.total}: <strong>{data.weekTotal}</strong>
      </Typography>

      <Typography variant="body2" color="text.secondary">
        {L.previousWeek}: {data.previousWeekTotal}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          mt: 1,
          fontWeight: 600,
          color: positive ? "success.main" : "error.main",
        }}
      >
        {positive ? L.positiveWeek : L.negativeWeek}
      </Typography>

      <Typography variant="body2" sx={{ mt: 1 }}>
        {L.averageTrend}: {positive ? L.trendUp : L.trendDown}{" "}
        {Math.abs(data.averageTrend)}%
      </Typography>
    </Box>
  );
};

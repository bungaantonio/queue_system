import { Box, Typography } from "@mui/material";
import { SLAMetric } from "./types";
import { getStatusColor, getStatusBg } from "./utils";
import { SLA_STATUS_LABELS } from "./labels";

interface Props {
  metric: SLAMetric;
}

export const SLAMetricRow = ({ metric }: Props) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {metric.label}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Meta: {metric.target}%
      </Typography>
    </Box>

    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, color: getStatusColor(metric.status) }}
      >
        {metric.current}%
      </Typography>

      <Box
        sx={{
          px: 1,
          py: 0.25,
          borderRadius: 1,
          backgroundColor: getStatusBg(metric.status),
          color: getStatusColor(metric.status),
          fontSize: "0.7rem",
          fontWeight: 600,
        }}
      >
        {SLA_STATUS_LABELS[metric.status]}
      </Box>
    </Box>
  </Box>
);

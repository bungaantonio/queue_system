// components/VolumeChartCompact.tsx
import { Card, CardContent, Typography, Box } from "@mui/material";

interface DayVolume {
  day: string;
  current: number;
  previous: number;
}
interface Props {
  data?: DayVolume[];
  height?: number;
}

export const VolumeChartCompact = ({ data = [], height = 200 }: Props) => {
  if (!data.length) return null;
  return (
    <Box sx={{ height, display: "flex", flexDirection: "column" }}>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        Volume Semanal
      </Typography>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        {data.map((d) => {
          const barHeight = Math.min(100, d.current);
          const prevHeight = Math.min(100, d.previous);
          const isPositive = d.current >= d.previous;

          return (
            <Box
              key={d.day}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box sx={{ position: "relative", width: 18, height: "100%" }}>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    height: prevHeight,
                    bgcolor: "grey.300",
                    opacity: 0.3,
                    borderRadius: 1,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    height: barHeight,
                    bgcolor: isPositive ? "success.main" : "error.main",
                    borderRadius: 1,
                  }}
                />
              </Box>
              <Typography variant="caption">{d.day}</Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

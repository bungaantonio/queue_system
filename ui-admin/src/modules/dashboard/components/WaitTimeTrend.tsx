// components/charts/waitTime/WaitTimeChartCompact.tsx
import { Card, CardContent, Typography, Box, Tooltip } from "@mui/material";

interface WaitTimePoint {
  hour: string;
  time: number;
}

interface Props {
  data: WaitTimePoint[];
  height?: number; // altura do card
}

export const WaitTimeChartCompact = ({ data, height = 200 }: Props) => {
  if (!data.length) return null;

  const min = Math.min(...data.map((d) => d.time));
  const max = Math.max(...data.map((d) => d.time));

  return (
    <Card sx={{ height }}>
      <CardContent
        sx={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          Tempo Médio de Espera
        </Typography>

        <Box sx={{ display: "flex", alignItems: "flex-end", flex: 1, gap: 1 }}>
          {data.map((d) => {
            const heightPercent = ((d.time - min) / (max - min)) * 100 || 10;
            const color =
              d.time <= min + (max - min) / 3
                ? "success.main"
                : d.time <= min + (2 * (max - min)) / 3
                  ? "warning.main"
                  : "error.main";

            return (
              <Tooltip key={d.hour} title={`${d.hour}: ${d.time} min`}>
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: `${heightPercent}%`,
                      bgcolor: color,
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="caption">{d.hour}</Typography>
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

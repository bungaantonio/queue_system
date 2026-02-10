// components/SLAMetricsCard.tsx
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";

interface Props {
  value?: number;
  target?: number;
  height?: number;
}
export const SLAMetricsCard = ({
  value = 94.2,
  target = 95,
  height = 200,
}: Props) => {
  const isAboveTarget = value >= target;
  return (
    <Card sx={{ height }}>
      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress
          variant="determinate"
          value={value}
          size={80}
          thickness={4}
          sx={{ color: isAboveTarget ? "success.main" : "warning.main", mb: 1 }}
        />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {value.toFixed(1)}%
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Meta: {target}%
        </Typography>
      </CardContent>
    </Card>
  );
};

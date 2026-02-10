// components/alerts/AlertsPanelCompact.tsx
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";
import { Users, Clock } from "lucide-react";
import { ReactNode } from "react";

interface AlertData {
  id: number;
  title: string;
  message: string;
  priority: "high" | "medium" | "low";
  icon?: ReactNode;
}

interface Props {
  showOnlyHigh?: boolean;
}

const alerts: AlertData[] = [
  {
    id: 1,
    title: "Fila acima do limite",
    message: "Fila excede 15 utilizadores",
    priority: "high",
    icon: <Users size={20} />,
  },
  {
    id: 2,
    title: "Violação de SLA",
    message: "3 utilizadores ultrapassaram tempo máximo",
    priority: "high",
    icon: <Clock size={20} />,
  },
  {
    id: 3,
    title: "Manutenção agendada",
    message: "02:00-04:00",
    priority: "low",
  },
];

export const AlertsPanelCompact = ({ showOnlyHigh = true }: Props) => {
  const filtered = showOnlyHigh
    ? alerts.filter((a) => a.priority === "high")
    : alerts;

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Alertas do Sistema
        </Typography>
        <List dense>
          {filtered.map((alert) => (
            <ListItem key={alert.id} disableGutters>
              {alert.icon && <ListItemIcon>{alert.icon}</ListItemIcon>}
              <ListItemText primary={alert.title} secondary={alert.message} />
              <Chip
                label={alert.priority.toUpperCase()}
                color={alert.priority === "high" ? "error" : "warning"}
                size="small"
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

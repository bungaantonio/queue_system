// components/activity/RecentActivityCompact.tsx
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

interface Activity {
  id: number;
  user: string;
  action: string;
  time: string;
}

interface Props {
  maxRows?: number;
}

const activities: Activity[] = [
  { id: 1, user: "John S.", action: "Completed", time: "há 2 min" },
  { id: 2, user: "Sarah J.", action: "Cancelled", time: "há 5 min" },
  { id: 3, user: "Mike W.", action: "Called", time: "há 8 min" },
  { id: 4, user: "Emma D.", action: "Completed", time: "há 12 min" },
];

export const RecentActivityCompact = ({ maxRows = 6 }: Props) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Atividades Recentes
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Utilizador</TableCell>
            <TableCell>Ação</TableCell>
            <TableCell>Hora</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activities.slice(0, maxRows).map((a) => (
            <TableRow key={a.id}>
              <TableCell>{a.user}</TableCell>
              <TableCell>{a.action}</TableCell>
              <TableCell>{a.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

// src/control/DashboardPage.tsx
import { QueueProvider } from "../../queue/QueueProvider";
import { CurrentAttendance } from "./CurrentAttendance";
import { QueueList } from "./QueueList";
import { Container, Stack, Typography } from "@mui/material";

export const ControlPage = () => {
  return (
    <QueueProvider>
      <Container sx={{ py: 4 }}>
        <Stack spacing={4}>
          <Typography variant="h4" fontWeight="bold">
            Painel de Atendimento
          </Typography>
          <CurrentAttendance />
          <QueueList />
        </Stack>
      </Container>
    </QueueProvider>
  );
};

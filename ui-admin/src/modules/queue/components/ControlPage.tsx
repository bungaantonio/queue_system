import { useContext, useState } from "react";
import {
  Title,
  Datagrid,
  TextField,
  FunctionField,
  Button as RaButton,
} from "react-admin";
import {
  Card,
  Box,
  Typography,
  CircularProgress,
  Button,
  Stack,
} from "@mui/material";
import { AtendimentoContext } from "./AtendimentoProvider";

// Ícones
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DoneIcon from "@mui/icons-material/Done";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import CancelIcon from "@mui/icons-material/Cancel";
import ReplayIcon from "@mui/icons-material/Replay";

export const ControlPage = () => {
  const context = useContext(AtendimentoContext);
  const [actionLoading, setActionLoading] = useState(false);

  if (!context || context.loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Sincronizando fila...</Typography>
      </Box>
    );
  }

  const { queue, called, current, callNext, finish, skip, cancel, requeue } =
    context;

  // --- LÓGICA DE UNIFICAÇÃO SEM DUPLICATAS ---
  const buildUniqueList = () => {
    // 1. Criamos um array bruto com a hierarquia: atual > chamado > fila
    const rawList = [
      ...(current ? [current] : []),
      ...(Array.isArray(called) ? called : called ? [called] : []),
      ...(queue || []),
    ];

    // 2. Filtramos para garantir que cada ID apareça apenas uma vez
    // (Prioriza a primeira aparição, que pela ordem acima é o status mais avançado)
    const uniqueList = rawList.filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id),
    );

    return uniqueList;
  };

  const allUsers = buildUniqueList();

  const handleAction = async (actionFn: () => Promise<any>) => {
    setActionLoading(true);
    try {
      await actionFn();
    } catch (e) {
      console.error("Erro na ação:", e);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box>
      <Title title="Painel de Atendimento" />

      {/* Barra de Ações */}
      <Card
        sx={{
          p: 2,
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={() => handleAction(callNext)}
            disabled={actionLoading || queue.length === 0 || !!called}
          >
            Chamar Próximo
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={() => handleAction(finish)}
            disabled={actionLoading || !current}
          >
            Finalizar
          </Button>

          <Button
            variant="outlined"
            color="warning"
            onClick={() => handleAction(skip)}
            disabled={actionLoading || !called}
          >
            Ausente
          </Button>
        </Stack>
        {actionLoading && <CircularProgress size={24} />}
      </Card>

      {/* Tabela */}
      <Card sx={{ p: 2 }}>
        <Datagrid data={allUsers} bulkActionButtons={false} rowClick={false}>
          <TextField source="position" label="Pos" />
          <TextField source="name" label="Utente" />

          <FunctionField
            label="Status"
            render={(record: any) => {
              const colors: any = {
                waiting: "orange",
                called_pending: "blue",
                being_served: "green",
              };
              return (
                <b style={{ color: colors[record.status] }}>
                  {record.status.toUpperCase()}
                </b>
              );
            }}
          />

          <FunctionField
            label="Ações"
            render={(record: any) => (
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleAction(() => cancel(record.id))}
                >
                  Remover
                </Button>
              </Stack>
            )}
          />
        </Datagrid>

        {allUsers.length === 0 && (
          <Box p={4} textAlign="center">
            Sem utentes na fila.
          </Box>
        )}
      </Card>
    </Box>
  );
};

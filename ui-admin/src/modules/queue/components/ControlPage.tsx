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

  // Handler genérico para ações para mostrar feedback visual de carregamento
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

  const calledArray = Array.isArray(called) ? called : called ? [called] : [];
  let allUsers = [...calledArray, ...queue];
  if (current) {
    allUsers = [current, ...allUsers.filter((u) => u.id !== current.id)];
  }

  return (
    <Box>
      <Title title="Painel de Atendimento" />

      {/* --- BARRA DE AÇÕES TOTAIS --- */}
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
            color="primary"
            startIcon={<PlayArrowIcon />}
            onClick={() => handleAction(callNext)}
            disabled={actionLoading || queue.length === 0 || !!called} // Só chama se houver gente e ninguém chamado
          >
            Chamar Próximo
          </Button>

          <Button
            variant="contained"
            color="success"
            startIcon={<DoneIcon />}
            onClick={() => handleAction(finish)}
            disabled={actionLoading || !current} // Só finaliza se houver alguém sendo atendido
          >
            Finalizar Atendimento
          </Button>

          <Button
            variant="outlined"
            color="warning"
            startIcon={<SkipNextIcon />}
            onClick={() => handleAction(skip)}
            disabled={actionLoading || !called} // Só pula se houver alguém chamado mas não apareceu
          >
            Pular / Ausente
          </Button>
        </Stack>

        {actionLoading && <CircularProgress size={24} />}
      </Card>

      {/* --- TABELA DA FILA --- */}
      <Card sx={{ p: 2 }}>
        <Box mb={2}>
          <Typography variant="h6">Fila de Atendimento</Typography>
        </Box>

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

          {/* --- AÇÕES POR LINHA --- */}
          <FunctionField
            label="Ações"
            render={(record: any) => (
              <Stack direction="row" spacing={1}>
                {/* Botão de Cancelar para qualquer um na fila */}
                <Button
                  size="small"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={() => handleAction(() => cancel(record.id))}
                >
                  Remover
                </Button>

                {/* Botão de Re-enfileirar (ex: mudar prioridade) */}
                <Button
                  size="small"
                  color="inherit"
                  startIcon={<ReplayIcon />}
                  onClick={() =>
                    handleAction(() => requeue(record.user_id, "priority"))
                  }
                >
                  Prioridade
                </Button>
              </Stack>
            )}
          />
        </Datagrid>

        {allUsers.length === 0 && (
          <Box p={4} textAlign="center">
            <Typography color="textSecondary">
              Nenhum utente aguardando.
            </Typography>
          </Box>
        )}
      </Card>
    </Box>
  );
};

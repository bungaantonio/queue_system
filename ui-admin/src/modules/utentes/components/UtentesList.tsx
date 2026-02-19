// src/modules/utentes/components/UtentesList.tsx
import {
  List,
  Datagrid,
  TextField,
  FunctionField,
  SearchInput,
  useListContext,
} from "react-admin";
import {
  Stack,
  Box,
  Paper,
  Typography,
  Chip,
  alpha,
  useTheme,
} from "@mui/material";
import { UserSearch, UserRoundCheck, Users } from "lucide-react";
import type { Utente } from "../utentes.types";
import { PageHeader } from "../../shared/components/PageHeader";
import { PageContainer } from "../../shared/components/PageContainer";
import {
  datagridBaseSx,
  datagridHoverSx,
  listMainTransparentSx,
} from "../../shared/styles/listStyles";

// Filtro de pesquisa — alwaysOn para estar sempre visível
const filters = [<SearchInput key="q" source="q" alwaysOn />];

export const UtentesList = () => (
  <PageContainer>
    <PageHeader
      title="Utentes"
      description="Base operacional para identificação e atendimento."
      icon={<UserSearch size={20} />}
    />

    <List filters={filters} perPage={25} sx={listMainTransparentSx}>
      {/* Cards de resumo — ficam dentro do contexto do List para aceder aos dados */}
      <UtentesOverview />

      {/* Tabela — único Paper, sem camadas */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: (theme) => alpha(theme.palette.divider, 0.8),
          overflow: "hidden",
        }}
      >
        {/* Cabeçalho da tabela */}
        <Box
          sx={{
            px: 2.5,
            py: 1.75,
            borderBottom: "1px solid",
            borderColor: (theme) => alpha(theme.palette.divider, 0.6),
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.03),
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                display: "grid",
                placeItems: "center",
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
              }}
            >
              <Users size={16} />
            </Box>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 800, lineHeight: 1.2 }}
              >
                Registos de utentes
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Clique numa linha para editar
              </Typography>
            </Box>
          </Stack>

          <Chip
            label="Pesquisa por nome ou documento"
            size="small"
            sx={{
              fontSize: "0.68rem",
              fontWeight: 600,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              color: "primary.main",
              border: "none",
              display: { xs: "none", md: "flex" },
            }}
          />
        </Box>

        {/* Datagrid sem wrapper extra */}
        <Datagrid
          rowClick="edit"
          bulkActionButtons={false}
          sx={{
            ...datagridBaseSx,
            ...datagridHoverSx,
            // Remove qualquer Paper/sombra interna que o react-admin injeta
            "& .RaDatagrid-root": { boxShadow: "none" },
            "& .column-id": {
              display: { xs: "none", sm: "table-cell" },
            },
          }}
        >
          <TextField
            source="id"
            label="Ref."
            sx={{ fontWeight: 700, color: "text.disabled", fontSize: "0.8rem" }}
          />
          <TextField source="name" label="Utente" sx={{ fontWeight: 700 }} />
          <FunctionField
            label="Identificação"
            render={(record: Utente) =>
              record.id_number || record.document_id ? (
                <Chip
                  label={record.id_number || record.document_id}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.72rem",
                    bgcolor: (theme) => alpha(theme.palette.success.main, 0.08),
                    color: "success.dark",
                    border: "1px solid",
                    borderColor: (theme) =>
                      alpha(theme.palette.success.main, 0.2),
                  }}
                />
              ) : (
                <Typography variant="caption" color="text.disabled">
                  —
                </Typography>
              )
            }
          />
        </Datagrid>
      </Paper>
    </List>
  </PageContainer>
);

// Overview de métricas — dentro do contexto do List
const UtentesOverview = () => {
  const { data = [], isPending } = useListContext<Utente>();
  const theme = useTheme();

  if (isPending) return null;

  const withDocument = data.filter((u) =>
    Boolean(u.id_number || u.document_id),
  ).length;

  const stats = [
    {
      icon: UserSearch,
      label: "Total registado",
      value: data.length,
      tone: theme.palette.primary.main,
    },
    {
      icon: UserRoundCheck,
      label: "Com identificação",
      value: withDocument,
      tone: theme.palette.success.main,
    },
  ];

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1.5}
      sx={{ mb: 1.5 }}
    >
      {stats.map(({ icon: Icon, label, value, tone }) => (
        <Paper
          key={label}
          elevation={0}
          sx={{
            flex: 1,
            p: 2,
            borderRadius: 2,
            border: "1px solid",
            borderColor: alpha(tone, 0.2),
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(tone, 0.07)} 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
            // Barra lateral colorida — identidade do sistema
            "&::before": {
              content: '""',
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "4px",
              bgcolor: tone,
            },
          }}
        >
          <Stack spacing={0.25} sx={{ pl: 0.5 }}>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 800,
                letterSpacing: 1,
                color: "text.secondary",
                lineHeight: 1.4,
              }}
            >
              {label}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, color: tone }}>
              {value}
            </Typography>
          </Stack>

          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: alpha(tone, 0.1),
              color: tone,
            }}
          >
            <Icon size={20} />
          </Box>
        </Paper>
      ))}
    </Stack>
  );
};

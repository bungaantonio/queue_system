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
  Card,
  Box,
  Paper,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { UserSearch, UserRoundCheck } from "lucide-react";
import type { Utente } from "../utentes.types";
import { PageHeader } from "../../shared/components/PageHeader";
import { PageContainer } from "../../shared/components/PageContainer";
import {
  datagridBaseSx,
  datagridHoverSx,
  listCardSx,
  listMainTransparentSx,
} from "../../shared/styles/listStyles";

export const UtentesList = () => (
  <PageContainer>
    <PageHeader
      title="Utentes"
      description="Base operacional para identificação e atendimento."
      icon={<UserSearch size={20} />}
    />

    <List
      filters={[<SearchInput key="q-filter" source="q" alwaysOn />]}
      perPage={25}
      sx={listMainTransparentSx}
    >
      <UtentesOverview />

      <Card
        sx={{
          ...listCardSx,
          borderRadius: 2,
          border: "1px solid",
          borderColor: (theme) => alpha(theme.palette.divider, 0.9),
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(
              theme.palette.background.default,
              0.5,
            )} 100%)`,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: (theme) =>
              `repeating-linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.05,
              )} 0px, ${alpha(
                theme.palette.primary.main,
                0.05,
              )} 6px, transparent 6px, transparent 14px)`,
            opacity: 0.35,
            pointerEvents: "none",
          },
        }}
      >
        <Box
          sx={{
            px: { xs: 2, md: 2.5 },
            pt: { xs: 2, md: 2.5 },
            pb: 1,
            borderBottom: "1px solid",
            borderColor: (theme) => alpha(theme.palette.divider, 0.8),
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              Registos de utentes
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Pesquisa ativa por nome ou documento
            </Typography>
          </Box>
          <Box
            sx={{
              height: 6,
              width: 44,
              borderRadius: 1,
              bgcolor: (theme) => theme.palette.primary.main,
              boxShadow: (theme) =>
                `0 0 0 4px ${alpha(theme.palette.primary.main, 0.15)}`,
            }}
          />
        </Box>
        <Datagrid
          rowClick="edit"
          bulkActionButtons={false}
          sx={{
            ...datagridBaseSx,
            ...datagridHoverSx,
            position: "relative",
            zIndex: 1,
            "& .MuiTableHead-root": {
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(
                  theme.palette.background.default,
                  0.6,
                )} 100%)`,
            },
            "& .MuiTableCell-head": {
              textTransform: "uppercase",
              fontSize: "0.68rem",
              letterSpacing: "0.1em",
            },
            "& .column-id": {
              display: { xs: "none", sm: "table-cell" },
            },
          }}
        >
          <TextField
            source="id"
            label="Ref."
            sx={{ fontWeight: 800, color: "text.disabled" }}
          />
          <TextField source="name" label="Utente" sx={{ fontWeight: 700 }} />
          <FunctionField
            label="Identificação"
            render={(record: Utente) =>
              record.id_number || record.document_id || "---"
            }
          />
        </Datagrid>
      </Card>
    </List>
  </PageContainer>
);

const UtentesOverview = () => {
  const { data = [], isPending } = useListContext<Utente>();
  const theme = useTheme();
  if (isPending) return null;

  const withDocument = data.filter((item) =>
    Boolean(item.id_number || item.document_id),
  ).length;

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ mb: 1.5 }}>
      {[
        {
          icon: UserSearch,
          label: "Total",
          value: data.length,
          tone: theme.palette.primary.main,
        },
        {
          icon: UserRoundCheck,
          label: "Identificados",
          value: withDocument,
          tone: theme.palette.success.main,
        },
      ].map((item) => {
        const Icon = item.icon;
        return (
          <Paper
            key={item.label}
            elevation={0}
            sx={{
              flex: 1,
              minWidth: { xs: "100%", md: 0 },
              p: 1.5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: alpha(item.tone, 0.2),
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(
                item.tone,
                0.08,
              )} 100%)`,
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "4px",
                bgcolor: item.tone,
              },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Stack spacing={0.3}>
              <Typography
                variant="overline"
                sx={{ fontWeight: 900, letterSpacing: 1.2 }}
              >
                {item.label}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900 }}>
                {item.value}
              </Typography>
            </Stack>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 1.5,
                display: "grid",
                placeItems: "center",
                bgcolor: alpha(item.tone, 0.12),
                color: item.tone,
              }}
            >
              <Icon size={18} />
            </Box>
          </Paper>
        );
      })}
    </Stack>
  );
};

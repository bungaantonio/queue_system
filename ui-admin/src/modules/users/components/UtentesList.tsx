// src/modules/users/components/UtentesList.tsx
import {
  List,
  Datagrid,
  TextField,
  FunctionField,
  SearchInput,
  useListContext,
} from "react-admin";
import { Box, Typography, Stack, alpha, Card, Chip } from "@mui/material";
import { UserSearch, UserRoundCheck } from "lucide-react";
import type { Utente } from "../utentes.types";

export const UtentesList = () => (
  <Box>
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
      <Box
        sx={{
          p: 1.25,
          bgcolor: "primary.main",
          borderRadius: 2.5,
          color: "white",
          display: "grid",
          placeItems: "center",
        }}
      >
        <UserSearch size={20} />
      </Box>
      <Box>
        <Typography variant="h4">Utentes</Typography>
        <Typography variant="body2" color="text.secondary">
          Base operacional para identificação e atendimento.
        </Typography>
      </Box>
    </Stack>

    <List
      filters={[<SearchInput key="q-filter" source="q" alwaysOn />]}
      perPage={25}
      sx={{ "& .RaList-main": { boxShadow: "none", bgcolor: "transparent" } }}
    >
      <UtentesOverview />

      <Card
        sx={{
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Datagrid
          rowClick="edit"
          bulkActionButtons={false}
          sx={{
            "& .MuiTableCell-head": { bgcolor: "background.default" },
            "& .MuiTableRow-root:hover": {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.03),
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
  </Box>
);

const UtentesOverview = () => {
  const { data = [], isPending } = useListContext<Utente>();
  if (isPending) return null;

  const withDocument = data.filter((item) =>
    Boolean(item.id_number || item.document_id),
  ).length;

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ mb: 1.5 }}>
      <Chip
        icon={<UserRoundCheck size={13} />}
        label={`${data.length} utente(s) carregados`}
        color="primary"
        variant="outlined"
      />
      <Chip
        label={`${withDocument} com identificação válida`}
        color="success"
        variant="outlined"
      />
    </Stack>
  );
};

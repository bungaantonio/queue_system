// src/modules/utentes/components/UtentesList.tsx
import {
  List,
  Datagrid,
  TextField,
  FunctionField,
  SearchInput,
  useListContext,
} from "react-admin";
import { Stack, Card, Chip } from "@mui/material";
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

      <Card sx={listCardSx}>
        <Datagrid
          rowClick="edit"
          bulkActionButtons={false}
          sx={{
            ...datagridBaseSx,
            ...datagridHoverSx,
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

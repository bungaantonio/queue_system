// src/modules/auditor/components/AuditShow.tsx
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  useRecordContext,
} from "react-admin";
import { Box, Typography } from "@mui/material";

// Componente auxiliar para booleanos coloridos
const BooleanFieldColored = ({
  source,
  label,
}: {
  source: string;
  label: string;
}) => {
  const record = useRecordContext();
  if (!record) return null;
  const value = record[source];
  return (
    <Typography
      variant="body2"
      sx={{ color: value ? "success.main" : "error.main", fontWeight: 500 }}
    >
      {label}: {value ? "Sim" : "Não"}
    </Typography>
  );
};

export const AuditShow = (props: any) => (
  <Show {...props} resource="audits">
    <Box sx={{ p: 3 }}>
      <SimpleShowLayout sx={{ "& > *": { mb: 1.5 } }}>
        <TextField source="audit_id" label="ID" sx={{ fontWeight: 600 }} />
        <TextField source="action" label="Ação" sx={{ fontWeight: 500 }} />
        <TextField source="operator_id" label="Operador" />
        <TextField source="user_id" label="Usuário" />
        <TextField source="queue_item_id" label="Fila" />
        <TextField
          source="recalculated_hash"
          label="Hash recalculado"
          sx={{ color: "text.secondary" }}
        />
        <TextField
          source="stored_hash"
          label="Hash armazenado"
          sx={{ color: "text.secondary" }}
        />
        <TextField
          source="previous_hash_matches"
          label="Hash anterior"
          sx={{ color: "text.secondary" }}
        />
        <BooleanFieldColored source="valid" label="Registro válido?" />
        <DateField source="timestamp" label="Data" showTime />
      </SimpleShowLayout>
    </Box>
  </Show>
);

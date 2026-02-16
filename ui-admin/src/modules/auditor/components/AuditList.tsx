// src/modules/auditor/components/AuditList.tsx
import { List, Datagrid, TextField, DateField, Title } from "react-admin";
import { Box, Card } from "@mui/material";
import { AuditSummary } from "./AuditSummary";
import { AuditIntegrityBadge } from "./AuditIntegrityBadge";
import { useGetHeader } from "../hooks/useAuditSummary";

export const AuditList = () => {
  const { summary } = useGetHeader();

  return (
    <Box>
      <Title title="Auditoria de Segurança" />

      <AuditSummary summary={summary} />

      <List
        sx={{ "& .RaList-main": { boxShadow: "none", bgcolor: "transparent" } }}
      >
        <Card
          sx={{
            borderRadius: 5,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          <Datagrid
            rowClick="show"
            sx={{
              "& .MuiTableCell-head": { bgcolor: "background.default" },
              "& .MuiTableCell-root": { py: 1.25 },
            }}
          >
            <TextField
              source="id"
              label="ID"
              sx={{
                fontWeight: 800,
                color: "text.disabled",
                fontSize: "0.7rem",
              }}
            />
            <TextField
              source="action"
              label="AÇÃO"
              sx={{
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: "0.75rem",
              }}
            />
            <TextField source="operator_id" label="OP" />
            <TextField source="user_id" label="UTENTE" />
            <DateField
              source="timestamp"
              label="HORÁRIO"
              showTime
              sx={{ color: "text.secondary" }}
            />
            <AuditIntegrityBadge source="valid" />
          </Datagrid>
        </Card>
      </List>
    </Box>
  );
};

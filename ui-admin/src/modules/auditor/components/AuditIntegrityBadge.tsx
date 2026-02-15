import { Typography, Stack, alpha } from "@mui/material";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { useRecordContext } from "react-admin";

export const AuditIntegrityBadge = ({
  source = "valid",
}: {
  source?: string;
}) => {
  const record = useRecordContext();
  const valid = Boolean(record?.[source]);

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        px: 1.5,
        py: 0.5,
        borderRadius: "6px",
        bgcolor: alpha(valid ? "#10b981" : "#e11d48", 0.08),
        border: `1px solid ${alpha(valid ? "#10b981" : "#e11d48", 0.2)}`,
        width: "fit-content",
      }}
    >
      {valid ? (
        <ShieldCheck size={14} color="#10b981" />
      ) : (
        <ShieldAlert size={14} color="#e11d48" />
      )}
      <Typography
        variant="caption"
        sx={{
          fontWeight: 900,
          color: valid ? "#10b981" : "#e11d48",
          fontSize: "0.6rem",
          letterSpacing: "0.05em",
        }}
      >
        {valid ? "REGISTRO INTEGRO" : "VIOLACAO DETECTADA"}
      </Typography>
    </Stack>
  );
};

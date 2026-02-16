import { Typography, Stack, alpha, useTheme } from "@mui/material";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { useRecordContext } from "react-admin";

export const AuditIntegrityBadge = ({
  source = "valid",
  value,
}: {
  source?: string;
  value?: boolean;
}) => {
  const theme = useTheme();
  const record = useRecordContext();
  const valid = value ?? Boolean(record?.[source]);
  const color = valid ? theme.palette.success.main : theme.palette.error.main;

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        px: 1.5,
        py: 0.5,
        borderRadius: "6px",
        bgcolor: alpha(color, 0.08),
        border: `1px solid ${alpha(color, 0.2)}`,
        width: "fit-content",
      }}
    >
      {valid ? (
        <ShieldCheck size={14} color={theme.palette.success.main} />
      ) : (
        <ShieldAlert size={14} color={theme.palette.error.main} />
      )}
      <Typography
        variant="caption"
        sx={{
          fontWeight: 900,
          color,
          fontSize: "0.6rem",
          letterSpacing: "0.05em",
        }}
      >
        {valid ? "REGISTRO INTEGRO" : "VIOLACAO DETECTADA"}
      </Typography>
    </Stack>
  );
};

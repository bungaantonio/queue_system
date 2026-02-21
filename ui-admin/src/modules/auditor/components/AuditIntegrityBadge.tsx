// src/modules/auditor/components/AuditIntegrityBadge.tsx
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
  const Icon = valid ? ShieldCheck : ShieldAlert;

  return (
    <Stack
      direction="row"
      spacing={0.75}
      alignItems="center"
      sx={{
        px: 1.25,
        py: 0.6,
        borderRadius: 1.5,
        bgcolor: alpha(color, 0.08),
        border: "1px solid",
        borderColor: alpha(color, 0.25),
        width: "fit-content",
      }}
    >
      <Icon size={13} color={color} strokeWidth={2.5} />
      <Typography
        sx={{
          fontFamily: "monospace",
          fontWeight: 700,
          color,
          fontSize: "0.62rem",
          letterSpacing: "0.08em",
        }}
      >
        {valid ? "ÍNTEGRO" : "VIOLAÇÃO"}
      </Typography>
    </Stack>
  );
};

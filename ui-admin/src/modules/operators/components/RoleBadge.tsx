import { Chip, alpha, useTheme } from "@mui/material";
import { ShieldCheck, UserCog, SearchCheck } from "lucide-react";
import { useRecordContext } from "react-admin";

const roleConfigs = {
  admin: { label: "Administrador", tone: "flow", icon: ShieldCheck },
  attendant: { label: "Atendente", tone: "ready", icon: UserCog },
  auditor: { label: "Auditor", tone: "stable", icon: SearchCheck },
};

export const RoleBadge = ({ source = "role" }: { source?: string }) => {
  const theme = useTheme();
  const record = useRecordContext();
  const config =
    roleConfigs[record?.[source] as keyof typeof roleConfigs] ||
    roleConfigs.attendant;
  const Icon = config.icon;
  const color =
    config.tone === "ready"
      ? theme.palette.success.main
      : config.tone === "stable"
        ? theme.palette.text.secondary
        : theme.palette.primary.main;

  return (
    <Chip
      icon={<Icon size={14} style={{ color }} />}
      label={config.label.toUpperCase()}
      sx={{
        borderRadius: "6px",
        fontWeight: 800,
        fontSize: "0.6rem",
        letterSpacing: "0.05em",
        bgcolor: alpha(color, 0.08),
        color,
        border: `1px solid ${alpha(color, 0.12)}`,
        "& .MuiChip-icon": { ml: 1 },
      }}
    />
  );
};

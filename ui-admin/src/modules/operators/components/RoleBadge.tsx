import { Chip, alpha } from "@mui/material";
import { ShieldCheck, UserCog, SearchCheck } from "lucide-react";
import { useRecordContext } from "react-admin";

const roleConfigs = {
  admin: { label: "Administrador", color: "#4f46e5", icon: ShieldCheck },
  attendant: { label: "Atendente", color: "#0ea5e9", icon: UserCog },
  auditor: { label: "Auditor", color: "#64748b", icon: SearchCheck },
};

export const RoleBadge = ({ source = "role" }: { source?: string }) => {
  const record = useRecordContext();
  const config =
    roleConfigs[record?.[source] as keyof typeof roleConfigs] ||
    roleConfigs.attendant;
  const Icon = config.icon;

  return (
    <Chip
      icon={<Icon size={14} style={{ color: config.color }} />}
      label={config.label.toUpperCase()}
      sx={{
        borderRadius: "6px",
        fontWeight: 800,
        fontSize: "0.6rem",
        letterSpacing: "0.05em",
        bgcolor: alpha(config.color, 0.08),
        color: config.color,
        border: `1px solid ${alpha(config.color, 0.1)}`,
        "& .MuiChip-icon": { ml: 1 },
      }}
    />
  );
};

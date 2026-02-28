import {
  Menu,
  DashboardMenuItem,
  useSidebarState,
  usePermissions,
} from "react-admin";
import { ListSubheader, Box } from "@mui/material";
import {
  LayoutDashboard,
  Users,
  Ticket,
  UserCog,
  FileCheck,
  ChartColumnIncreasing,
} from "lucide-react";

const Section = ({
  children,
  open,
}: {
  children: React.ReactNode;
  open: boolean;
}) => (
  <ListSubheader
    disableSticky
    className="MyMenu-section"
    sx={{
      display: open ? "block" : "none",
      pl: 2.5,
      pr: 2,
      py: 0.75,
      borderTop: "1px solid",
      borderColor: "divider",
    }}
  >
    {children}
  </ListSubheader>
);

export const MyMenu = () => {
  const [open] = useSidebarState();
  const { permissions } = usePermissions<string>();
  const role = permissions ?? null;

  return (
    <Menu>
      <Box sx={{ py: 0.5 }}>
        <DashboardMenuItem
          leftIcon={<LayoutDashboard size={18} strokeWidth={2.5} />}
          primaryText="Visão Geral"
        />
      </Box>

      <Section open={open}>Operacional</Section>
      <Box sx={{ py: 0.5 }}>
        <Menu.Item
          to="/atendimento"
          primaryText="Atendimento"
          leftIcon={<Ticket size={18} strokeWidth={2.5} />}
        />
        <Menu.Item
          to="/utentes"
          primaryText="Utentes"
          leftIcon={<Users size={18} strokeWidth={2.5} />}
        />
      </Box>

      <Section open={open}>Sistema</Section>
      <Box sx={{ py: 0.5 }}>
        {role === "admin" || role === "auditor" ? (
          <Menu.Item
            to="/operators"
            primaryText="Equipa"
            leftIcon={<UserCog size={18} strokeWidth={2.5} />}
          />
        ) : null}
        {role === "auditor" ? (
          <Menu.Item
            to="/audits"
            primaryText="Auditoria"
            leftIcon={<FileCheck size={18} strokeWidth={2.5} />}
          />
        ) : null}
        {role === "admin" || role === "auditor" ? (
          <Menu.Item
            to="/audit-metrics"
            primaryText="Métricas"
            leftIcon={<ChartColumnIncreasing size={18} strokeWidth={2.5} />}
          />
        ) : null}
      </Box>
    </Menu>
  );
};

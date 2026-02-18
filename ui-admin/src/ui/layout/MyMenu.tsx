import { Menu, DashboardMenuItem, useSidebarState } from "react-admin";
import { ListSubheader, Box } from "@mui/material";
import {
  LayoutDashboard,
  Users,
  Ticket,
  UserCog,
  FileCheck,
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
        <Menu.Item
          to="/operators"
          primaryText="Equipa"
          leftIcon={<UserCog size={18} strokeWidth={2.5} />}
        />
        <Menu.Item
          to="/audits"
          primaryText="Auditoria"
          leftIcon={<FileCheck size={18} strokeWidth={2.5} />}
        />
      </Box>
    </Menu>
  );
};

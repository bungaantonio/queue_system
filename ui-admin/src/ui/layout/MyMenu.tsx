import { Menu, DashboardMenuItem } from "react-admin";
import { ListSubheader, Box } from "@mui/material";
import {
  LayoutDashboard,
  Users,
  Ticket,
  UserCog,
  FileCheck,
} from "lucide-react";

const Section = ({ children }: { children: React.ReactNode }) => (
  <ListSubheader disableSticky className="MyMenu-section">
    {children}
  </ListSubheader>
);

export const MyMenu = () => (
  <Menu>
    <Box sx={{ py: 0.5 }}>
      <DashboardMenuItem
        leftIcon={<LayoutDashboard size={18} strokeWidth={2.5} />}
        primaryText="Visão Geral"
      />
    </Box>

    <Section>Operacional</Section>
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

    <Section>Sistema</Section>
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

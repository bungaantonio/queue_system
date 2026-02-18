// src/ui/layout/MyMenu.tsx
import { Menu, DashboardMenuItem } from "react-admin";
import { ListSubheader } from "@mui/material";
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
    <DashboardMenuItem
      leftIcon={<LayoutDashboard size={18} />}
      primaryText="Visão Geral"
    />

    <Section>Operacional</Section>
    <Menu.Item
      to="/atendimento"
      primaryText="Atendimento"
      leftIcon={<Ticket size={18} />}
    />
    <Menu.Item
      to="/utentes"
      primaryText="Utentes"
      leftIcon={<Users size={18} />}
    />

    <Section>Sistema</Section>
    <Menu.Item
      to="/operators"
      primaryText="Equipa"
      leftIcon={<UserCog size={18} />}
    />
    <Menu.Item
      to="/audits"
      primaryText="Auditoria"
      leftIcon={<FileCheck size={18} />}
    />
  </Menu>
);
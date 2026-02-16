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

export const MyMenu = () => (
  <Menu>
    <DashboardMenuItem
      leftIcon={<LayoutDashboard size={20} />}
      primaryText="Visão Geral"
    />

    <ListSubheader disableSticky className="MyMenu-section">
      OPERACIONAL
    </ListSubheader>
    <Menu.Item
      to="/atendimento"
      primaryText="Atendimento"
      leftIcon={<Ticket size={20} />}
    />
    <Menu.Item
      to="/utentes"
      primaryText="Utentes"
      leftIcon={<Users size={20} />}
    />

    <ListSubheader disableSticky className="MyMenu-section">
      SISTEMA
    </ListSubheader>
    <Menu.Item
      to="/operators"
      primaryText="Equipa"
      leftIcon={<UserCog size={20} />}
    />
    <Menu.Item
      to="/audits"
      primaryText="Auditoria"
      leftIcon={<FileCheck size={20} />}
    />
  </Menu>
);

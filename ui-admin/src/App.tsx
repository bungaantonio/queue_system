// src/app/App.tsx
import { Admin, Resource, CustomRoutes } from "react-admin";
import { Route } from "react-router-dom";
import { adminDataProvider } from "./application/adminDataProvider";
import { adminAuthProvider } from "./application/adminAuthProvider";

import { OperatorsList } from "./modules/operators/components/OperatorsList";
import { OperatorsCreate } from "./modules/operators/components/OperatorsCreate";
import { OperatorsEdit } from "./modules/operators/components/OperatorsEdit";

import { ControlPage } from "./modules/queue/components/ControlPage";

import { DashboardPage } from "./modules/dashboard/DashboardPage.tsx";

import { UtentesCreate } from "./modules/users/components/UtentesCreate";
import { UtentesList } from "./modules/users/components/UtentesList";
import { UtentesEdit } from "./modules/users/components/UtentesEdit";

import { SessionExpiredPage } from "./modules/shared/components/SessionExpiredPage";
import { NotAuthorizedPage } from "./modules/shared/components/NotAuthorizedPage";

import { AtendimentoProvider } from "./modules/queue/components/AtendimentoProvider";

import { withRole } from "./modules/shared/utils/withRole";

import { premiumTheme } from "./ui/theme.ts";
import { AdminLayout } from "./ui/layout/AdminLayout";

// Ícones realistas
import QueueIcon from "@mui/icons-material/Queue";
import BadgeIcon from "@mui/icons-material/Badge";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { AuditList } from "./modules/auditor/components/AuditList";
import { AuditShow } from "./modules/auditor/components/AuditShow";

export const App = () => (
  <AtendimentoProvider>
    <Admin
      theme={premiumTheme}
      layout={AdminLayout}
      authProvider={adminAuthProvider}
      dataProvider={adminDataProvider}
      dashboard={DashboardPage}
      disableTelemetry
    >
      {/* Painel de Atendimento */}
      <Resource
        name="atendimento"
        list={ControlPage}
        icon={QueueIcon}
        options={{ label: "Atendimento" }}
      />

      {/* Operadores */}
      <Resource
        name="operators"
        list={withRole(OperatorsList, ["admin"])}
        edit={withRole(OperatorsEdit, ["admin"])}
        create={withRole(OperatorsCreate, ["admin"])}
        icon={BadgeIcon}
        options={{ label: "Operadores" }}
      />

      {/* Utentes */}
      <Resource
        name="utentes"
        list={withRole(UtentesList, ["admin", "attendant"])}
        edit={withRole(UtentesEdit, ["admin", "attendant"])}
        create={withRole(UtentesCreate, ["admin", "attendant"])}
        icon={PersonSearchIcon}
        options={{ label: "Utentes" }}
      />

      {/* Auditor */}
      <Resource
        name="audits"
        list={withRole(AuditList, ["auditor"])}
        show={withRole(AuditShow, ["auditor"])}
        options={{ label: "Auditoria" }}
      />
      <CustomRoutes>
        <Route path="/session-expired" element={<SessionExpiredPage />} />
        <Route path="/not-authorized" element={<NotAuthorizedPage />} />
      </CustomRoutes>
    </Admin>
  </AtendimentoProvider>
);

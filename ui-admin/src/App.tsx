// src/app/App.tsx
import { Admin, Resource, CustomRoutes } from "react-admin";
import { Route } from "react-router-dom";

import { adminDataProvider } from "./application/adminDataProvider";
import { adminAuthProvider } from "./application/adminAuthProvider";
import { i18nProvider } from "./application/i18nProvider";

import { DashboardPage } from "./modules/dashboard/DashboardPage.tsx";

import { OperatorsList } from "./modules/operators/components/OperatorsList";
import { OperatorsCreate } from "./modules/operators/components/OperatorsCreate";
import { OperatorsEdit } from "./modules/operators/components/OperatorsEdit";

import { AtendimentoProvider } from "./modules/queue/components/AtendimentoProvider";
import { AtendimentoPanel } from "./modules/queue/components/AtendimentoPanel.tsx";

import { UtentesCreate } from "./modules/utentes/components/UtentesCreate.tsx";
import { UtentesList } from "./modules/utentes/components/UtentesList.tsx";
import { UtentesEdit } from "./modules/utentes/components/UtentesEdit.tsx";

import { AuditList } from "./modules/auditor/components/AuditList";
import { AuditShow } from "./modules/auditor/components/AuditShow";

import { SessionExpiredPage } from "./modules/shared/components/SessionExpiredPage";
import { NotAuthorizedPage } from "./modules/shared/components/NotAuthorizedPage";

import { withRole } from "./modules/shared/utils/withRole";

import { theme } from "./ui/theme";
import { MyLayout } from "./ui/layout/MyLayout";

import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import RecentActorsRoundedIcon from "@mui/icons-material/RecentActorsRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";

export const App = () => (
  <AtendimentoProvider>
    <Admin
      theme={theme}
      layout={MyLayout}
      authProvider={adminAuthProvider}
      dataProvider={adminDataProvider}
      i18nProvider={i18nProvider}
      dashboard={DashboardPage}
      disableTelemetry
    >
      {/* Painel de Atendimento */}
      <Resource
        name="atendimento"
        list={AtendimentoPanel}
        icon={SupportAgentRoundedIcon}
        options={{ label: "Painel de Atendimento" }}
      />

      {/* Operadores */}
      <Resource
        name="operators"
        list={withRole(OperatorsList, ["admin"])}
        edit={withRole(OperatorsEdit, ["admin"])}
        create={withRole(OperatorsCreate, ["admin"])}
        icon={ManageAccountsRoundedIcon}
        options={{ label: "Operadores" }}
      />

      {/* Utentes */}
      <Resource
        name="utentes"
        list={withRole(UtentesList, ["admin", "attendant"])}
        edit={withRole(UtentesEdit, ["admin", "attendant"])}
        create={withRole(UtentesCreate, ["admin", "attendant"])}
        icon={RecentActorsRoundedIcon}
        options={{ label: "Utentes" }}
      />

      {/* Auditor */}
      <Resource
        name="audits"
        list={withRole(AuditList, ["auditor"])}
        show={withRole(AuditShow, ["auditor"])}
        icon={FactCheckRoundedIcon}
        options={{ label: "Auditoria" }}
      />
      <CustomRoutes>
        <Route path="/session-expired" element={<SessionExpiredPage />} />
        <Route path="/not-authorized" element={<NotAuthorizedPage />} />
      </CustomRoutes>
    </Admin>
  </AtendimentoProvider>
);

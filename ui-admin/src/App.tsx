// src/app/App.tsx
import { Admin, Resource } from "react-admin";
import { adminDataProvider } from "./application/adminDataProvider";
import { adminAuthProvider } from "./application/adminAuthProvider";

import { OperatorsList } from "./modules/operators/components/OperatorsList";
import { OperatorsCreate } from "./modules/operators/components/OperatorsCreate";
import { OperatorsEdit } from "./modules/operators/components/OperatorsEdit";

import { ControlPage } from "./modules/queue/components/ControlPage";

import { DashboardPage } from "./modules/dashboard/pages/DashboardPage";

import { UtentesCreate } from "./modules/users/components/UtentesCreate";
import { UtentesList } from "./modules/users/components/UtentesList";
import { UtentesEdit } from "./modules/users/components/UtentesEdit";

import { AtendimentoProvider } from "./modules/queue/components/AtendimentoProvider";

// Ícones realistas
import QueueIcon from "@mui/icons-material/Queue";
import BadgeIcon from "@mui/icons-material/Badge";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { sessionStore } from "./core/session/sessionStorage";

export const App = () => (
  <AtendimentoProvider>
    <Admin
      authProvider={adminAuthProvider}
      dataProvider={adminDataProvider}
      dashboard={DashboardPage}
    >
      {/* Painel de Atendimento */}
      <Resource
        name="atendimento"
        list={ControlPage}
        icon={QueueIcon}
        options={{ label: "Painel de Atendimento" }}
      />

      {/* Operadores */}
      <Resource
        name="operators"
        list={(props) => {
          const user = sessionStore.getUser();
          if (user?.role !== "admin") return null;
          return <OperatorsList {...props} />;
        }}
        edit={OperatorsEdit}
        create={OperatorsCreate}
        icon={BadgeIcon}
        options={{ label: "Operadores" }}
      />

      {/* Utentes */}
      <Resource
        name="utentes"
        list={UtentesList}
        edit={UtentesEdit}
        create={UtentesCreate}
        icon={PersonSearchIcon}
        options={{ label: "Utentes" }}
      />
    </Admin>
  </AtendimentoProvider>
);

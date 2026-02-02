// src/App.tsx
import { Admin, Resource } from "react-admin";
import operatorDataProvider from "./operators/dataProvider";
import { authProvider } from "./auth/authProvider";
import { OperatorsList } from "./operators/OperatorsList";
import { OperatorsCreate } from "./operators/OperatorsCreate";
import { OperatorsEdit } from "./operators/OperatorsEdit";
import { ControlPage } from "./components/queue/ControlPage";
import { DashboardPage } from "./dashboard/pages/DashboardPage";
import { UtentesCreate } from "./utentes/UtentesCreate";
import { UtentesList } from "./utentes/UtentesList";
import { UtentesEdit } from "./utentes/UtentesEdit";

// ícones mais realistas
import Queue from "@mui/icons-material/Queue";
import BadgeIcon from "@mui/icons-material/Badge";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";

export const App = () => (
  <Admin
    authProvider={authProvider}
    dataProvider={operatorDataProvider}
    dashboard={DashboardPage}
  >
    <Resource
      name="control"
      list={ControlPage}
      icon={Queue}
      options={{ label: "Painel de Atendimento" }}
    />
    <Resource
      name="operators"
      list={(props) => <OperatorsList {...props} permissions="admin" />}
      edit={OperatorsEdit}
      create={OperatorsCreate}
      icon={BadgeIcon}
      options={{ label: "Operadores" }}
    />
    <Resource
      name="utentes"
      list={UtentesList}
      edit={UtentesEdit}
      create={UtentesCreate}
      icon={PersonSearchIcon}
      options={{ label: "Utentes" }}
    />
  </Admin>
);

// src/App.tsx
import { Admin, Resource, ListGuesser } from "react-admin";
import operatorDataProvider from "./operators/dataProvider";
import { authProvider } from "./operators/authProvider";
import { OperatorsList } from "./operators/OperatorsList";
import { OperatorsCreate } from "./operators/OperatorsCreate";
import { OperatorsEdit } from "./operators/OperatorsEdit";
import { ControlPage } from "./control/pages/ControlPage";
import { DashboardPage } from "./dashboard/pages/DashboardPage";

export const App = () => (
    <Admin
        authProvider={authProvider}
        dataProvider={operatorDataProvider}
        dashboard={DashboardPage}
    >
        {/* Página customizada fora do RA padrão */}
        <Resource
            name="control"
            list={ControlPage}
            options={{ label: "Painel de Controle" }}
        />

        {/* Operadores com permissões e UI otimizada */}
        <Resource
            name="operators"
            list={(props) => <OperatorsList {...props} permissions="admin" />}
            edit={OperatorsEdit}
            create={OperatorsCreate}
            options={{ label: "Operadores" }}
        />
    </Admin>
);

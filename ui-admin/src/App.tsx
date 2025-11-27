// src/App.tsx
import { Admin, Resource } from "react-admin";
import operatorDataProvider from "./operators/dataProvider";
import { authProvider } from "./operators/authProvider";
import { OperatorsList } from "./operators/OperatorsList";
import { OperatorsCreate } from "./operators/OperatorsCreate";
import { OperatorsEdit } from "./operators/OperatorsEdit";
import { ControlPage } from "./control/pages/ControlPage";
import { DashboardPage } from "./dashboard/pages/DashboardPage";

export const App = () => (
    <Admin
        authProvider={authProvider as any} // investigar esse 'as any'
        dataProvider={operatorDataProvider}
        dashboard={DashboardPage}

    >
        <Resource
            name="control"
            list={ControlPage}
            options={{ label: "Painel de Controle" }}
        />
        <Resource
            name="operators"
            list={OperatorsList}
            edit={OperatorsEdit}
            create={OperatorsCreate}
            options={{ label: "Operadores" }}
        />
    </Admin>
);

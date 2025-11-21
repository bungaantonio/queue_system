// src/App.tsx
import { Admin, Resource } from "react-admin";
import operatorDataProvider from "./operators/dataProvider";
import { authProvider } from "./operators/authProvider";
import { OperatorsList } from "./operators/OperatorsList";
import { OperatorsCreate } from "./operators/OperatorsCreate";
import { OperatorsEdit } from "./operators/OperatorsEdit";
import { DashboardPage } from "./dashboard/pages/DashboardPage";

export const App = () => (
    <Admin
        authProvider={authProvider}
        dataProvider={operatorDataProvider}
        dashboard={DashboardPage}
    >
        <Resource
            name="operators"
            list={OperatorsList}
            edit={OperatorsEdit}
            create={OperatorsCreate}
        />
    </Admin>
);

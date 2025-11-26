// src/App.tsx
import { Admin, Resource } from "react-admin";
import operatorDataProvider from "./operators/dataProvider";
import { authProvider } from "./operators/authProvider";
import { OperatorsList } from "./operators/OperatorsList";
import { OperatorsCreate } from "./operators/OperatorsCreate";
import { OperatorsEdit } from "./operators/OperatorsEdit";
import { ControlPage } from "./control/pages/ControlPage";

export const App = () => (
    <Admin
        authProvider={authProvider as any} // investigar esse 'as any'
        dataProvider={operatorDataProvider}
        dashboard={ControlPage}
    >
        <Resource
            name="operators"
            list={OperatorsList}
            edit={OperatorsEdit}
            create={OperatorsCreate}
        />
    </Admin>
);

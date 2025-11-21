import { Admin, Resource } from "react-admin";
import operatorDataProvider from "./dataProvider";
import { authProvider } from "./authProvider";
import { OperatorsList } from "./operators/OperatorsList";
import { OperatorsCreate } from "./operators/OperatorsCreate";
import { OperatorsEdit } from "./operators/OperatorsEdit";

export const App = () => (
    <Admin authProvider={authProvider} dataProvider={operatorDataProvider}>
        <Resource
            name="operators"
            list={OperatorsList}
            edit={OperatorsEdit}
            create={OperatorsCreate}
        />
    </Admin>
);
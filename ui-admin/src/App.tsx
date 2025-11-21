import { Admin, Resource } from "react-admin";
import operatorDataProvider from "./operators/dataProvider";
import { authProvider } from "./operators/authProvider";
import { OperatorsList } from "./operators/OperatorsList";
import { OperatorsCreate } from "./operators/OperatorsCreate";
import { OperatorsEdit } from "./operators/OperatorsEdit";
import { QueueList } from "./dashboard/components/QueueList";

export const App = () => (
    <Admin authProvider={authProvider} dataProvider={operatorDataProvider}>
        <Resource name="queue" list={QueueList} />
        <Resource
            name="operators"
            list={OperatorsList}
            edit={OperatorsEdit}
            create={OperatorsCreate}
        />
    </Admin>
);
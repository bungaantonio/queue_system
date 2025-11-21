import { Admin, Resource } from "react-admin";
import authProvider from "./authProvider";
import dataProvider from "./dataProvider";
import { OperatorList } from "./operators/OperatorList";
import { AttendantList } from "./operators/AttendantListerFilter";
import { OperatorCreate } from "./operators/OperatorCreate";
import { OperatorEdit } from "./operators/OperatorEdit";

export const App = () => (
    <Admin authProvider={authProvider} dataProvider={dataProvider}>
        <Resource
            name="operators"
            list={OperatorList}

            create={OperatorCreate}
            edit={OperatorEdit}
        // edit pode ser adicionado futuramente
        />
        <Resource name="Atendentes"
            list={AttendantList}
        />
    </Admin>
);
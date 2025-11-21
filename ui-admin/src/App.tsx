import { Admin } from "react-admin";
import { Layout } from "./Layout";
import authProvider from "./authProvider";
import dataProvider from "./dataProvider";

export const App = () => (
    <Admin
        layout={Layout}
        authProvider={authProvider}
        dataProvider={dataProvider}
    />
);
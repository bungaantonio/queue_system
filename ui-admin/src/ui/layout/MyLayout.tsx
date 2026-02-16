// src/ui/layout/MyLayout.tsx
import { Layout, LayoutProps } from "react-admin";
import { MyAppBar } from "./MyAppBar";
import { MyMenu } from "./MyMenu";

export const MyLayout = (props: LayoutProps) => (
  <Layout {...props} appBar={MyAppBar} menu={MyMenu} />
);

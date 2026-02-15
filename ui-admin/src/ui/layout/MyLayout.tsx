// src/ui/layout/MyLayout.tsx
import { Layout } from "react-admin";
import { MyAppBar } from "./MyAppBar";
import { MyMenu } from "./MyMenu";
import type { ComponentProps } from "react";

type LayoutProps = ComponentProps<typeof Layout>;

export const MyLayout = (props: LayoutProps) => (
  <Layout
    {...props}
    appBar={MyAppBar}
    menu={MyMenu}
    sx={{
      "& .RaLayout-content": {
        // Redundância de segurança para garantir o "espaço para respirar"
        padding: "32px !important",
        backgroundColor: "background.default",
        minHeight: "100vh",
      },
    }}
  />
);

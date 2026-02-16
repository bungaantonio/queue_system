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
      "& .RaLayout-contentWithSidebar": {
        minHeight: "calc(100dvh - 62px)",
      },
      "& .RaLayout-content": {
        width: "100%",
        maxWidth: "1460px",
        marginInline: "auto",
        paddingInline: { xs: 12, md: 16, xl: 24 },
        paddingBlock: { xs: 12, md: 16 },
        backgroundColor: "background.default",
        boxSizing: "border-box",
      },
    }}
  />
);

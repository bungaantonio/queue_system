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
      "& .RaLayout-appFrame": {
        backgroundColor: "background.default",
      },
      "& .RaSidebar-drawerPaper": {
        mt: "56px",
        height: "calc(100dvh - 56px)",
        borderRight: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
      },
      "& .RaLayout-contentWithSidebar": {
        minHeight: "calc(100dvh - 56px)",
      },
      "& .RaLayout-content": {
        width: "100%",
        maxWidth: "1480px",
        marginInline: "auto",
        marginTop: "0 !important",
        paddingInline: { xs: 10, md: 14, xl: 20 },
        paddingTop: { xs: 4, md: 6 },
        paddingBottom: { xs: 12, md: 16 },
        backgroundColor: "transparent",
        boxSizing: "border-box",
      },
    }}
  />
);

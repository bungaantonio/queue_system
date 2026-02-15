// src/app/routes.tsx
import { createBrowserRouter } from "react-router-dom";
import Display from "../pages/Display";
import ConsultPage from "../features/consult/ConsultPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Display />,
  },
  {
    path: "/consultar",
    element: <ConsultPage />,
  },
]);

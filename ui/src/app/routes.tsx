// src/app/routes.tsx
import { createHashRouter } from "react-router-dom";
import Display from "../pages/Display";
import ConsultPage from "../features/consult/ConsultPage";

export const router = createHashRouter([
  {
    path: "/",
    element: <Display />,
  },
  {
    path: "/consultar",
    element: <ConsultPage />,
  },
]);

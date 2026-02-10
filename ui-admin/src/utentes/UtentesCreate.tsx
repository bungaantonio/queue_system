// src/utentes/UtentesCreate.tsx
import { Create, SimpleForm } from "react-admin";
import { UtenteForm } from "./UtenteForm";

export const UtentesCreate = () => (
  <Create>
    <SimpleForm sx={{ maxWidth: 1000 }}>
      <UtenteForm />
    </SimpleForm>
  </Create>
);

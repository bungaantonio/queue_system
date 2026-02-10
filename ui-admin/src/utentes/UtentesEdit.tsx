// src/utentes/UtentesEdit.tsx
import { Edit, SimpleForm } from "react-admin";
import { UtenteForm } from "./UtenteForm";

export const UtentesEdit = () => (
  <Edit>
    <SimpleForm sx={{ maxWidth: 1000 }}>
      <UtenteForm />
    </SimpleForm>
  </Edit>
);

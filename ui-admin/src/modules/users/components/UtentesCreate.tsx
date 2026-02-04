// src/features/utentes/UtentesCreate.tsx
import { Create, SimpleForm, TextInput, DateInput } from "react-admin";
import { BiometricInput } from "./BiometricInput";

export const UtentesCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" label="Nome Completo" fullWidth />
      <TextInput source="document_id" label="Documento (ID)" />

      {/* Campo customizado que integra com o hardware */}
      <BiometricInput source="biometric_id" operatorId={42} />

      <TextInput source="phone" label="Telefone" />
      <DateInput source="birth_date" label="Data de Nascimento" />
    </SimpleForm>
  </Create>
);

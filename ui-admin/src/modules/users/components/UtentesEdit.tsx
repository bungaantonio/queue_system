import { Edit, SimpleForm, TextInput, DateInput } from "react-admin";
import { BiometricInput } from "../components/BiometricInput";

export const UtentesEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" label="Nome Completo" fullWidth />
      <TextInput source="document_id" label="Documento (ID)" />
      <BiometricInput source="biometric_id" operatorId={42} />
      <TextInput source="phone" label="Telefone" />
      <DateInput source="birth_date" label="Data de Nascimento" />
    </SimpleForm>
  </Edit>
);

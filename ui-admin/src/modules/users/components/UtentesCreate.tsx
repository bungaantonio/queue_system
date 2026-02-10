import {
  Create,
  SimpleForm,
  TextInput,
  DateInput,
  BooleanInput,
  SelectInput,
} from "react-admin";
import { BiometricInput } from "./BiometricInput";

export const UtentesCreate = () => (
  <Create
    mutationMode="pessimistic"
    transform={(data) => ({
      user: {
        name: data.name,
        birth_date: data.birth_date,
        is_pregnant: data.is_pregnant ?? false,
        pregnant_until: data.pregnant_until ?? null,
        is_disabled_temp: data.is_disabled_temp ?? false,
        disabled_until: data.disabled_until ?? null,
        document_id: data.document_id,
        phone: data.phone,
      },
      credential: {
        identifier: data.biometric_id,
      },
      attendance_type: data.attendance_type || "urgent",
    })}
  >
    <SimpleForm>
      <TextInput source="name" label="Nome Completo" fullWidth />
      <TextInput source="document_id" label="Documento (ID)" />
      <TextInput source="phone" label="Telefone" />
      <DateInput source="birth_date" label="Data de Nascimento" />

      <BooleanInput source="is_pregnant" label="Está Grávida?" />
      <DateInput source="pregnant_until" label="Até quando?" />
      <BooleanInput
        source="is_disabled_temp"
        label="Tem deficiência temporária?"
      />
      <DateInput source="disabled_until" label="Até quando?" />

      <BiometricInput source="biometric_id" operatorId={42} />

      <SelectInput
        source="attendance_type"
        label="Tipo de Atendimento"
        choices={[
          { id: "urgent", name: "Urgente" },
          { id: "normal", name: "Normal" },
        ]}
      />
    </SimpleForm>
  </Create>
);

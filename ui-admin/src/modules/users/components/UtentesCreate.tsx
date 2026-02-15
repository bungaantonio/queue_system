import {
  Create,
  SimpleForm,
  TextInput,
  DateInput,
  BooleanInput,
  SelectInput,
  required,
} from "react-admin";
import { BiometricInput } from "./BiometricInput";
import { utentesGateway } from "../utentesGateway";
import type { UtenteCreatePayload } from "../utentes.types";

interface UtentesCreateFormValues {
  name: string;
  birth_date: string;
  document_id: string;
  phone: string;
  is_pregnant?: boolean;
  pregnant_until?: string | null;
  is_disabled_temp?: boolean;
  disabled_until?: string | null;
  credential_identifier: string;
  attendance_type: "normal" | "priority" | "urgent";
}

export const UtentesCreate = () => {
  const handleSave = async (values: UtentesCreateFormValues) => {
    if (!values.credential_identifier) {
      throw new Error("Credencial biométrica não capturada.");
    }

    const payload: UtenteCreatePayload = {
      user: {
        name: values.name,
        birth_date: values.birth_date,
        document_id: values.document_id,
        phone: values.phone,
        is_pregnant: values.is_pregnant ?? false,
        pregnant_until: values.pregnant_until ?? null,
        is_disabled_temp: values.is_disabled_temp ?? false,
        disabled_until: values.disabled_until ?? null,
      },
      credential: { identifier: values.credential_identifier },
      attendance_type: values.attendance_type,
    };

    await utentesGateway.create(payload);
  };

  return (
    <Create redirect="list">
      <SimpleForm
        onSubmit={(values: any) =>
          handleSave(values as UtentesCreateFormValues)
        }
      >
        <TextInput source="name" label="Nome Completo" validate={required()} />
        <TextInput
          source="document_id"
          label="Nº Documento"
          validate={required()}
        />
        <TextInput
          source="phone"
          label="Contacto Telefónico"
          validate={required()}
        />
        <DateInput
          source="birth_date"
          label="Data de Nascimento"
          validate={required()}
        />
        <BiometricInput source="credential_identifier" operatorId={42} />
        <BooleanInput source="is_pregnant" label="Utente Gestante" />
        <DateInput source="pregnant_until" label="Data prevista parto" />
        <BooleanInput source="is_disabled_temp" label="Mobilidade Reduzida" />
        <DateInput source="disabled_until" label="Validade do atestado" />
        <SelectInput
          source="attendance_type"
          label="Tipo de Atendimento"
          validate={required()}
          choices={[
            { id: "normal", name: "Normal (Geral)" },
            { id: "priority", name: "Prioritário (Crianças/Grávidas/Idosos)" },
            { id: "urgent", name: "Urgente (Emergência)" },
          ]}
        />
      </SimpleForm>
    </Create>
  );
};

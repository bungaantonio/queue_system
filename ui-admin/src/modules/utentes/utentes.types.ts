export interface UserPayload {
  name: string;
  birth_date: string;
  document_id: string;
  phone: string;
  is_pregnant: boolean;
  pregnant_until: string | null;
  is_disabled_temp: boolean;
  disabled_until: string | null;
}

export interface CredentialPayload {
  identifier: string;
}

export interface UtenteCreatePayload {
  user: UserPayload;
  credential: CredentialPayload;
  attendance_type: "normal" | "priority" | "urgent";
}
export interface Utente {
  id: number;
  name: string;
  id_number?: string;
  document_id?: string;
  phone?: string;
  birth_date?: string;
  is_pregnant?: boolean;
  pregnant_until?: string | null;
  is_disabled_temp?: boolean;
  disabled_until?: string | null;
  credential?: string;
}

export interface UtenteApiListItem {
  id: number;
  name: string;
  id_number?: string;
  document_id?: string;
  phone?: string;
  birth_date?: string;
  is_pregnant?: boolean;
  pregnant_until?: string | null;
  is_disabled_temp?: boolean;
  disabled_until?: string | null;
  credential?: string;
}

export const normalizeUtente = (input: UtenteApiListItem): Utente => ({
  id: input.id,
  name: input.name,
  id_number: input.id_number ?? input.document_id,
  document_id: input.document_id ?? input.id_number,
  phone: input.phone,
  birth_date: input.birth_date,
  is_pregnant: input.is_pregnant,
  pregnant_until: input.pregnant_until,
  is_disabled_temp: input.is_disabled_temp,
  disabled_until: input.disabled_until,
  credential: input.credential,
});

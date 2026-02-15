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
  attendance_type: "normal" | "urgent";
}

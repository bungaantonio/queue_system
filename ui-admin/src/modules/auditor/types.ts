// src/modules/auditor/types.ts
export interface AuditVerificationDetail {
  id: number;
  action: string;
  operator_id: number | null;
  operator_username: string | null;
  user_id: number | null;
  user_name: string | null;
  queue_item_id: number | null;
  credential_id: number | null;
  recalculated_hash: string;
  stored_hash: string;
  previous_hash_matches: boolean; // Cadeia (Elo)
  content_integrity: boolean; // Assinatura (Dados)
  valid: boolean;
  timestamp: string;
  details?: Record<string, unknown> | null;

  investigation_note?: string | null;
  investigated_at?: string | null;
  investigated_by_id?: number | null;
}

export interface AuditChainSummary {
  all_valid: boolean;
  total_records: number;
  valid_records: number;
  invalid_records: number;
}

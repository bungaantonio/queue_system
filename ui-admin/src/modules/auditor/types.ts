export interface AuditVerificationDetail {
  id: number;
  action: string;
  operator_id: number | null;
  user_id: number | null;
  queue_item_id: number | null;
  recalculated_hash: string;
  stored_hash: string;
  previous_hash_matches: boolean;
  valid: boolean;
  timestamp: string; // ISO 8601
  details?: Record<string, unknown> | null;
}

export interface AuditChainSummary {
  all_valid: boolean;
  total_records: number;
  valid_records: number;
  invalid_records: number;
}

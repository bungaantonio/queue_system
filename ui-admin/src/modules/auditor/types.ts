export interface AuditVerificationDetail {
  audit_id: number;
  action: string;
  user_id: number | null;
  recalculated_hash: string;
  stored_hash: string;
  previous_hash_matches: boolean;
  valid: boolean;
  timestamp: string; // ISO 8601
  details?: Record<string, any> | null;
}

export interface AuditChainSummary {
  all_valid: boolean;
  total_records: number;
  valid_records: number;
  invalid_records: number;
}

// src/shared/http/HttpError.ts
export type HttpErrorType = "auth" | "validation" | "business" | "unknown";

export interface HttpError extends Error {
  status: number;
  type: HttpErrorType;
  details?: any; // opcional, útil para validação 422
}

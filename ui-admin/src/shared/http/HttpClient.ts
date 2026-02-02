// src/shared/http/HttpClient.ts
export interface HttpClient {
  get<T = any>(path: string): Promise<T>;
  post<T = any>(path: string, body?: unknown): Promise<T>;
  put<T = any>(path: string, body?: unknown): Promise<T>;
  delete<T = any>(path: string): Promise<T>;
}

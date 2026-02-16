export interface LoginData {
  username: string;
  password: string;
}

export interface LoginResponseData {
  access_token: string;
  refresh_token: string;
  token_type?: string;
}

export interface RefreshTokenData {
  refresh_token: string;
}

export interface RefreshResponseData {
  access_token: string;
  token_type?: string;
}

export interface UserData {
  username: string;
  role: string;
}

export interface ApiErrorBody {
  message: string;
  code?: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: ApiErrorBody | null;
}

export const isApiResponse = <T>(value: unknown): value is ApiResponse<T> => {
  if (!value || typeof value !== "object") return false;
  return "data" in value && "success" in value;
};

export const getApiPayload = <T>(value: unknown): T => {
  if (isApiResponse<T>(value)) return value.data;
  return value as T;
};

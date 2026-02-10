// auth.types.ts

// Dados enviados para login
export interface LoginData {
  username: string;
  password: string;
}

// Dados retornados pelo login
export interface LoginResponseData {
  access_token: string;
  refresh_token: string;
  token_type?: string; // geralmente "bearer"
}

// Body enviado para refresh
export interface RefreshTokenData {
  refresh_token: string;
}

// Dados retornados pelo refresh
export interface RefreshResponseData {
  access_token: string;
  token_type?: string;
}

// Dados do usuário decodificados do JWT
export interface UserData {
  username: string;
  role: string;
}

// Estrutura genérica de resposta do backend
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: { message: string } | null;
}

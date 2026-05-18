export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id?: number | string;
  name?: string;
  email?: string;
  role?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user?: AuthUser;
  };
}

export interface AuthMeResponse {
  success: boolean;
  message?: string;
  data?: {
    user?: AuthUser;
  };
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
}

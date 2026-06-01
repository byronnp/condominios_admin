export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id?: number | string;
  name?: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string;
  role?: string | { id: number | string; name: string } | null;
  identification_type?: { id: number | string; name: string } | null;
  identification_number?: string | null;
  mobile_phone?: string | null;
  landline_phone?: string | null;
  is_active?: boolean;
  last_login_at?: string | null;
  last_active_at?: string | null;
  managed_condominiums?: string | null;
}

export interface AuthMenu {
  id: number | string;
  parent_id: number | string | null;
  code: string;
  label: string;
  route_name: string | null;
  path: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  required_role: string | null;
  required_permission: string | null;
  children?: AuthMenu[] | null;
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

export interface AuthMenusResponse {
  success: boolean;
  message?: string;
  data?: AuthMenu[] | null;
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
}

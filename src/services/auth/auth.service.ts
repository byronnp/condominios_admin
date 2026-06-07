import type {
  AuthMenusResponse,
  AuthMeResponse,
  LoginPayload,
  LoginResponse,
  LogoutResponse,
} from '../../interfaces/auth/login.interface';
import { apiGet, apiPost, apiPostWithoutPayload } from '../api.service';

export function login(payload: LoginPayload) {
  return apiPost<LoginResponse, LoginPayload>('auth/login', payload);
}

export function getAuthenticatedUser() {
  return apiGet<AuthMeResponse>('auth/me');
}

export function getAuthenticatedMenus() {
  return apiGet<AuthMenusResponse>('auth/me/menus');
}

export function logout() {
  return apiPostWithoutPayload<LogoutResponse>('auth/logout');
}

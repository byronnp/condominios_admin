import { ref } from 'vue';
import type { LoginPayload } from '../interfaces/auth/login.interface';
import { getAuthenticatedUser, login, logout } from '../services/auth.service';
import { useAuthStore } from '../stores/auth-store';

export function useAuth() {
  const loading = ref(false);
  const error = ref('');
  const authStore = useAuthStore();

  async function signIn(payload: LoginPayload) {
    loading.value = true;
    error.value = '';

    try {
      const response = await login(payload);
      if (!response.success) {
        throw new Error(response.message || 'No se pudo iniciar sesion');
      }

      authStore.setSession(response.data?.user);
      return response;
    } catch (exception) {
      error.value = exception instanceof Error ? exception.message : 'No se pudo iniciar sesion';
      throw exception;
    } finally {
      loading.value = false;
    }
  }

  async function loadSession() {
    loading.value = true;
    error.value = '';

    try {
      const response = await getAuthenticatedUser();
      if (!response.success) {
        throw new Error(response.message || 'No hay una sesion activa');
      }

      authStore.setSession(response.data?.user);
      return response;
    } catch (exception) {
      authStore.clearSession();
      error.value = exception instanceof Error ? exception.message : 'No hay una sesion activa';
      throw exception;
    } finally {
      loading.value = false;
    }
  }

  async function signOut() {
    loading.value = true;
    error.value = '';

    try {
      const response = await logout();
      return response;
    } finally {
      authStore.clearSession();
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    signIn,
    loadSession,
    signOut,
    authStore,
  };
}

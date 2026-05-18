import { acceptHMRUpdate, defineStore } from 'pinia';
import type { AuthUser } from '../interfaces/auth/login.interface';
import type { UserRole } from '../interfaces/shared/user-role.interface';

type AuthState = {
  user: AuthUser | null;
  role: UserRole;
  isAuthenticated: boolean;
};

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    role: 'super-admin',
    isAuthenticated: false,
  }),

  getters: {
    userName: (state) => state.user?.name || 'Maria Beltran',
    userEmail: (state) => state.user?.email || '',
  },

  actions: {
    setSession(user?: AuthUser) {
      this.user = user || null;
      this.role = normalizeRole(user?.role);
      this.isAuthenticated = true;
    },

    clearSession() {
      this.user = null;
      this.role = 'super-admin';
      this.isAuthenticated = false;
    },
  },
});

function normalizeRole(role?: string): UserRole {
  if (role === 'condo-admin' || role === 'resident' || role === 'super-admin') {
    return role;
  }

  return 'super-admin';
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}

import { acceptHMRUpdate, defineStore } from 'pinia';
import type { AuthMenu, AuthUser } from '../interfaces/auth/login.interface';
import type { UserRole } from '../interfaces/shared/user-role.interface';

type AuthState = {
  user: AuthUser | null;
  menus: AuthMenu[];
  role: UserRole;
  isAuthenticated: boolean;
};

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    menus: [],
    role: 'super-admin',
    isAuthenticated: false,
  }),

  getters: {
    userName: (state) => state.user?.name || 'Usuario',
    userEmail: (state) => state.user?.email || '',
    userRoleName: (state) => {
      if (!state.user?.role) {
        return '';
      }

      return typeof state.user.role === 'string' ? state.user.role : state.user.role.name;
    },
  },

  actions: {
    setSession(user?: AuthUser) {
      this.user = user || null;
      this.role = normalizeRole(user?.role);
      this.isAuthenticated = true;
    },

    setMenus(menus?: AuthMenu[] | null) {
      this.menus = Array.isArray(menus) ? menus : [];
    },

    clearSession() {
      this.user = null;
      this.menus = [];
      this.role = 'super-admin';
      this.isAuthenticated = false;
    },
  },
});

function normalizeRole(role?: AuthUser['role']): UserRole {
  const roleName = typeof role === 'string' ? role : role?.name;

  if (roleName === 'condo-admin' || roleName === 'resident' || roleName === 'super-admin') {
    return roleName;
  }

  return 'super-admin';
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}

<template>
  <q-layout view="lHh Lpr lFf" class="app-shell">
    <q-header class="app-header">
      <q-toolbar class="app-toolbar">
        <div class="header-left">
          <q-btn
            flat
            dense
            round
            :icon="isDrawerMini ? 'menu_open' : 'menu'"
            aria-label="Abrir menu"
            class="drawer-toggle"
            @click="toggleLeftDrawer"
          />

          <div class="brand-block">
            <div class="brand-mark">CA</div>
            <div>
              <q-toolbar-title class="brand-title">Condominios Admin</q-toolbar-title>
              <div class="brand-subtitle">{{ roleLabel }}</div>
            </div>
          </div>
        </div>

        <div class="header-context">
          <q-icon :name="currentSection.icon" />
          <div>
            <span>{{ currentSection.label }}</span>
            <small>{{ userScope }}</small>
          </div>
        </div>

        <q-space />

        <q-btn flat round dense icon="notifications" aria-label="Notificaciones" class="header-icon-btn">
          <q-badge floating rounded color="accent" label="3" />
        </q-btn>

        <q-btn-dropdown flat no-caps class="user-menu">
          <template #label>
            <div class="user-menu__label">
            <q-avatar size="34px" color="primary" text-color="white">{{ userInitials }}</q-avatar>
            <div class="user-menu__text">
                <span>{{ userName }}</span>
                <small>{{ userScope }}</small>
              </div>
            </div>
          </template>
          <q-list dense>
            <q-item clickable v-close-popup>
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>
              <q-item-section>Mi perfil</q-item-section>
            </q-item>
            <q-item clickable v-close-popup :disable="authLoading" @click="handleLogout">
              <q-item-section avatar>
                <q-icon name="logout" />
              </q-item-section>
              <q-item-section>Cerrar sesion</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="app-drawer"
      :width="284"
      :mini-width="76"
      :mini="isDrawerMini"
    >
      <div class="drawer-profile">
        <q-avatar size="44px" color="primary" text-color="white">{{ userInitials }}</q-avatar>
        <div>
          <strong>{{ roleLabel }}</strong>
          <span>{{ userScope }}</span>
        </div>
      </div>

      <q-list class="nav-list">
        <q-item
          v-for="item in menuItems"
          :key="item.label"
          clickable
          :to="item.to"
          :exact="item.to === '/'"
          active-class="nav-item--active"
          class="nav-item"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>{{ item.label }}</q-item-section>
          <q-tooltip v-if="isDrawerMini" anchor="center right" self="center left">
            {{ item.label }}
          </q-tooltip>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component, route }">
        <transition name="page-transition" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useAuthStore } from '../stores/auth-store';
import type { UserRole } from '../interfaces/shared/user-role.interface';

const leftDrawerOpen = ref(false);
const drawerMini = ref(false);
const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { signOut, loading: authLoading } = useAuth();

const isDrawerMini = computed(() => drawerMini.value && !$q.screen.lt.md);

const currentRole = computed(() => authStore.role);
const userName = computed(() => authStore.userName);
const userInitials = computed(() => {
  return userName.value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0]?.toUpperCase())
    .join('');
});

const roleLabel = computed(() => {
  const labels: Record<UserRole, string> = {
    'super-admin': 'Super administrador',
    'condo-admin': 'Administrador de condominio',
    resident: 'Condomino',
  };

  return labels[currentRole.value];
});

const userScope = computed(() => {
  const scopes: Record<UserRole, string> = {
    'super-admin': 'Vista global de la plataforma',
    'condo-admin': 'Condominio Mirador Norte',
    resident: 'Casa B-14',
  };

  return scopes[currentRole.value];
});

const currentSection = computed(() => {
  if (route.path.startsWith('/condominios/nuevo')) {
    return { label: 'Nuevo condominio', icon: 'add_business' };
  }

  if (route.path.includes('/condominios/') && route.path.endsWith('/editar')) {
    return { label: 'Editar condominio', icon: 'edit' };
  }

  if (route.path.startsWith('/condominios')) {
    return { label: 'Condominios', icon: 'apartment' };
  }

  if (route.path.startsWith('/administradores/nuevo')) {
    return { label: 'Nuevo administrador', icon: 'person_add' };
  }

  if (route.path.includes('/administradores/') && route.path.endsWith('/editar')) {
    return { label: 'Editar administrador', icon: 'edit' };
  }

  if (route.path.startsWith('/administradores')) {
    return { label: 'Administradores', icon: 'manage_accounts' };
  }

  if (route.path.startsWith('/usuarios/nuevo')) {
    return { label: 'Nuevo usuario', icon: 'person_add' };
  }

  if (route.path.includes('/usuarios/') && route.path.endsWith('/editar')) {
    return { label: 'Editar usuario', icon: 'edit' };
  }

  if (route.path.startsWith('/usuarios')) {
    return { label: 'Usuarios', icon: 'groups' };
  }

  if (route.path.startsWith('/reportes')) {
    return { label: 'Reportes', icon: 'analytics' };
  }

  if (route.path.startsWith('/configuracion')) {
    return { label: 'Configuracion', icon: 'settings' };
  }

  return { label: 'Dashboard', icon: 'dashboard' };
});

const menuItems = computed(() => {
  const shared = [{ label: 'Inicio', icon: 'dashboard', to: '/' }];
  const roleMenus: Record<UserRole, { label: string; icon: string; to?: string }[]> = {
    'super-admin': [
      ...shared,
      { label: 'Condominios', icon: 'apartment', to: '/condominios' },
      { label: 'Administradores', icon: 'manage_accounts', to: '/administradores' },
      { label: 'Usuarios', icon: 'groups', to: '/usuarios' },
      { label: 'Reportes', icon: 'analytics', to: '/reportes' },
      { label: 'Configuracion', icon: 'settings', to: '/configuracion' },
    ],
    'condo-admin': [
      ...shared,
      { label: 'Propiedades', icon: 'home_work' },
      { label: 'Residentes', icon: 'group' },
      { label: 'Pagos', icon: 'payments' },
      { label: 'Invitados', icon: 'badge' },
      { label: 'Comunicados', icon: 'campaign' },
      { label: 'Reportes', icon: 'bar_chart' },
    ],
    resident: [
      ...shared,
      { label: 'Mi vivienda', icon: 'home' },
      { label: 'Pagos', icon: 'receipt_long' },
      { label: 'Invitados', icon: 'how_to_reg' },
      { label: 'Comunicados', icon: 'notifications' },
      { label: 'Solicitudes', icon: 'support_agent' },
    ],
  };

  return roleMenus[currentRole.value];
});

function toggleLeftDrawer() {
  if ($q.screen.lt.md) {
    leftDrawerOpen.value = !leftDrawerOpen.value;
    return;
  }

  drawerMini.value = !drawerMini.value;
}

async function handleLogout() {
  await signOut().catch(() => undefined);
  void router.push('/login');
}
</script>

<template>
  <q-layout view="lHh Lpr lFf" class="app-shell">
    <q-header class="app-header">
      <q-toolbar class="app-toolbar">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Abrir menu"
          class="mobile-menu-btn"
          @click="toggleLeftDrawer"
        />

        <div class="brand-block">
          <div class="brand-mark">CA</div>
          <div>
            <q-toolbar-title class="brand-title">Condominios Admin</q-toolbar-title>
            <div class="brand-subtitle">{{ roleLabel }}</div>
          </div>
        </div>

        <q-space />

        <q-btn-dropdown flat no-caps class="user-menu">
          <template #label>
            <div class="user-menu__label">
              <q-avatar size="34px" color="primary" text-color="white">MB</q-avatar>
              <div class="user-menu__text">
                <span>Maria Beltran</span>
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
            <q-item clickable v-close-popup to="/login">
              <q-item-section avatar>
                <q-icon name="logout" />
              </q-item-section>
              <q-item-section>Cerrar sesion</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="app-drawer" :width="284">
      <div class="drawer-profile">
        <q-avatar size="44px" color="primary" text-color="white">MB</q-avatar>
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
          active-class="nav-item--active"
          class="nav-item"
          :active="item.active"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>{{ item.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

type UserRole = 'super-admin' | 'condo-admin' | 'resident';

const leftDrawerOpen = ref(false);

const currentRole = computed<UserRole>(() => {
  if (typeof window === 'undefined') {
    return 'super-admin';
  }

  const storedRole = window.localStorage.getItem('condominios-role');
  if (storedRole === 'condo-admin' || storedRole === 'resident') {
    return storedRole;
  }

  return 'super-admin';
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

const menuItems = computed(() => {
  const shared = [{ label: 'Inicio', icon: 'dashboard', active: true }];
  const roleMenus: Record<UserRole, { label: string; icon: string; active?: boolean }[]> = {
    'super-admin': [
      ...shared,
      { label: 'Condominios', icon: 'apartment' },
      { label: 'Administradores', icon: 'manage_accounts' },
      { label: 'Usuarios', icon: 'groups' },
      { label: 'Reportes', icon: 'analytics' },
      { label: 'Configuracion', icon: 'settings' },
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
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

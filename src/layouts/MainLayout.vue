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
              <q-toolbar-title class="brand-title">{{ currentSection.label }}</q-toolbar-title>
              <div class="brand-subtitle">{{ currentSection.subtitle }}</div>
            </div>
          </div>
        </div>

        <q-input
          v-model="headerSearch"
          outlined
          dense
          hide-bottom-space
          placeholder="Buscar en la plataforma..."
          class="header-search"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
          <template #append>
            <div class="header-search__hint">âŒ˜ K</div>
          </template>
        </q-input>

        <q-space />

        <q-btn flat round dense icon="notifications" aria-label="Notificaciones" class="header-icon-btn" @click="goToNotifications">
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
            <q-item clickable v-close-popup @click="goToProfile">
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
      :class="['app-drawer', { 'app-drawer--mini': isDrawerMini }]"
      :width="304"
      :mini-width="72"
      :mini="isDrawerMini"
    >
      <div class="drawer-brand">
        <div class="drawer-brand__mark">
          <q-icon name="apartment" />
        </div>
        <div class="drawer-brand__text">
          <strong>Condominios</strong>
          <span>Panel administrativo</span>
        </div>
      </div>

      <div class="drawer-profile-card">
        <q-avatar size="40px" color="white" text-color="primary" class="drawer-profile-card__avatar">
          {{ userInitials }}
        </q-avatar>
        <div class="drawer-profile-card__content">
          <strong>{{ userName }}</strong>
          <span>{{ userEmail || userScope }}</span>
        </div>
        <q-icon name="expand_more" size="20px" />
      </div>

      <q-scroll-area class="drawer-scroll">
        <div class="drawer-sections">
          <section v-for="section in drawerSections" :key="section.key" class="drawer-section">
            <p v-if="section.label" class="drawer-section__title">{{ section.label }}</p>

            <div v-if="section.header" class="drawer-section__header">
              <div class="drawer-section__header-icon">
                <q-icon :name="normalizeMenuIcon(section.header.icon)" />
              </div>
              <div class="drawer-section__header-copy">
                <strong>{{ section.header.label }}</strong>
                <span v-if="section.label">{{ section.label }}</span>
              </div>
            </div>

            <q-list class="nav-list">
              <template v-for="item in section.items" :key="item.key">
                <div v-if="item.children.length > 0" class="nav-group">
                  <q-item
                    :clickable="Boolean(item.to)"
                    :to="item.to"
                    :exact="item.to === '/'"
                    active-class="nav-item--active"
                    class="nav-item nav-item--root"
                  >
                    <q-item-section avatar>
                      <q-icon :name="normalizeMenuIcon(item.icon)" />
                    </q-item-section>
                    <q-item-section>{{ item.label }}</q-item-section>
                  </q-item>

                  <div class="nav-group__children">
                    <q-item
                      v-for="child in item.children"
                      :key="child.key"
                      :clickable="Boolean(child.to)"
                      :to="child.to"
                      :exact="child.to === '/'"
                      active-class="nav-item--active"
                      class="nav-item nav-item--child"
                    >
                      <q-item-section avatar>
                        <q-icon :name="normalizeMenuIcon(child.icon)" />
                      </q-item-section>
                      <q-item-section>{{ child.label }}</q-item-section>
                    </q-item>
                  </div>
                </div>

                <q-item
                  v-else
                  :clickable="Boolean(item.to)"
                  :to="item.to"
                  :exact="item.to === '/'"
                  active-class="nav-item--active"
                  class="nav-item"
                >
                  <q-item-section avatar>
                    <q-icon :name="normalizeMenuIcon(item.icon)" />
                  </q-item-section>
                  <q-item-section>{{ item.label }}</q-item-section>
                  <q-tooltip v-if="isDrawerMini" anchor="center right" self="center left">
                    {{ item.label }}
                  </q-tooltip>
                </q-item>
              </template>
            </q-list>
          </section>
        </div>
      </q-scroll-area>

      <div class="drawer-footer-card">
        <div class="drawer-footer-card__icon">
          <q-icon name="shield" />
        </div>
        <div class="drawer-footer-card__content">
          <strong>Sistema seguro</strong>
          <span>Tus datos estan protegidos con cifrado de nivel empresarial.</span>
        </div>
        <div class="drawer-footer-card__status" />
      </div>
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
import { useAuth } from '../composables/auth/useAuth';
import { normalizeMenuIcon } from '../composables/shared/menu-icons';
import { useAuthStore } from '../stores/auth-store';
import type { UserRole } from '../interfaces/shared/user-role.interface';
import type { AuthMenu } from '../interfaces/auth/login.interface';

type NavMenuItem = {
  key: string;
  id?: string;
  parentId?: string | number | null;
  label: string;
  icon: string;
  to?: string | undefined;
  sortOrder: number;
  children: NavMenuItem[];
};

type DrawerSection = {
  key: string;
  label?: string | undefined;
  header?: NavMenuItem | undefined;
  items: NavMenuItem[];
};

const leftDrawerOpen = ref(false);
const drawerMini = ref(false);
const headerSearch = ref('');
const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { signOut, loading: authLoading } = useAuth();

const isDrawerMini = computed(() => drawerMini.value && !$q.screen.lt.md);

const currentRole = computed<UserRole>(() => {
  const role = authStore.role;

  if (role === 'super-admin' || role === 'condo-admin' || role === 'resident') {
    return role;
  }

  return 'super-admin';
});

const userName = computed(() => authStore.userName);
const userEmail = computed(() => authStore.userEmail);
const userInitials = computed(() => {
  return userName.value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0]?.toUpperCase())
    .join('');
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
  if (route.path.startsWith('/admin/condominiums')) {
    return { label: 'Condominios', subtitle: 'Gestion central de conjuntos', icon: 'apartment' };
  }

  if (route.path.startsWith('/admin/houses')) {
    return { label: 'Casas', subtitle: 'Inventario global de viviendas', icon: 'home_work' };
  }

  if (route.path.startsWith('/admin/residents')) {
    return { label: 'Residentes', subtitle: 'Padron y vinculos por casa', icon: 'groups' };
  }

  if (route.path.startsWith('/admin/payments')) {
    return { label: 'Pagos', subtitle: 'Control de cobros y movimientos', icon: 'payments' };
  }

  if (route.path.startsWith('/admin/board')) {
    return { label: 'Directivas', subtitle: 'Periodos y miembros por condominio', icon: 'groups' };
  }

  if (route.path.startsWith('/admin/fee-rates')) {
    return { label: 'Tarifas de alicuotas', subtitle: 'Configuracion de tarifas base', icon: 'badge' };
  }

  if (route.path.startsWith('/admin/alicuotas')) {
    return { label: 'Alicuotas', subtitle: 'Configuracion de cuotas y valores', icon: 'receipt_long' };
  }

  if (route.path.startsWith('/admin/payment-methods')) {
    return { label: 'Metodos de pago', subtitle: 'Formas de cobro habilitadas', icon: 'wallet' };
  }

  if (route.path.startsWith('/admin/catalogs')) {
    return { label: 'Catalogos', subtitle: 'Catalogos globales del sistema', icon: 'list_tree' };
  }

  if (route.path.startsWith('/admin/menus')) {
    return { label: 'Menus', subtitle: 'Estructura de navegacion y permisos', icon: 'menu' };
  }

  if (route.path.startsWith('/admin/audit-logs')) {
    return { label: 'Auditoria', subtitle: 'Registro de acciones del sistema', icon: 'shield_check' };
  }

  if (route.path.startsWith('/perfil')) {
    return { label: 'Perfil', subtitle: 'Informacion de tu cuenta', icon: 'person' };
  }

  if (route.path.startsWith('/admin/comunicados')) {
    return { label: 'Comunicados', subtitle: 'Mensajes y avisos operativos', icon: 'campaign' };
  }

  if (route.path.startsWith('/admin/solicitudes-mantenimiento')) {
    return { label: 'Mantenimiento', subtitle: 'Solicitudes y seguimiento', icon: 'build' };
  }

  if (route.path.startsWith('/resident/houses')) {
    return { label: 'Mi hogar', subtitle: 'Panel principal del residente', icon: 'home' };
  }

  if (route.path.startsWith('/resident/payments')) {
    return { label: 'Mis pagos', subtitle: 'Historial de pagos de la casa', icon: 'credit_card' };
  }

  if (route.path.startsWith('/resident/advance-payments')) {
    return { label: 'Adelantar alicuotas', subtitle: 'Pagos adelantados por el residente', icon: 'calendar_month' };
  }

  if (route.path.startsWith('/resident/invitations')) {
    return { label: 'Invitaciones', subtitle: 'Accesos temporales de la casa', icon: 'badge' };
  }

  if (route.path.startsWith('/condominios/nuevo')) {
    return { label: 'Nuevo condominio', subtitle: 'Crea un nuevo espacio dentro del sistema', icon: 'add_business' };
  }

  if (route.path.includes('/condominios/') && route.path.endsWith('/editar')) {
    return { label: 'Editar condominio', subtitle: 'Actualiza datos y configuracion', icon: 'edit' };
  }

  if (route.path.includes('/condominios/') && route.path.endsWith('/administradores')) {
    return { label: 'Administradores', subtitle: 'Vista global de la plataforma', icon: 'manage_accounts' };
  }

  if (route.path.includes('/condominios/') && route.path.endsWith('/casas')) {
    return { label: 'Casas', subtitle: 'Gestion de viviendas por condominio', icon: 'home_work' };
  }

  if (route.path.includes('/condominios/') && route.path.endsWith('/directiva')) {
    return { label: 'Directiva', subtitle: 'Miembros y cargos del condominio', icon: 'groups' };
  }

  if (route.path.startsWith('/admin/casas/duenos/nuevo')) {
    return { label: 'Nuevo dueÃ±o', subtitle: 'Asigna o crea un propietario', icon: 'person_add' };
  }

  if (route.path.includes('/admin/casas/') && route.path.endsWith('/historial')) {
    return { label: 'Historial de casa', subtitle: 'Consulta cambios y eventos', icon: 'history' };
  }

  if (route.path.startsWith('/admin/casas')) {
    return { label: 'Casas', subtitle: 'Inventario global de viviendas', icon: 'home_work' };
  }

  if (route.path.startsWith('/admin/pagos')) {
    return { label: 'Pagos', subtitle: 'Control de cobros y movimientos', icon: 'payments' };
  }

  if (route.path.startsWith('/admin/invitaciones')) {
    return { label: 'Invitaciones', subtitle: 'Gestion de accesos temporales', icon: 'badge' };
  }

  if (route.path.startsWith('/estado-cuenta')) {
    return { label: 'Estado de cuenta', subtitle: 'Resumen financiero personal', icon: 'account_balance_wallet' };
  }

  if (route.path.startsWith('/notificaciones')) {
    return { label: 'Notificaciones', subtitle: 'Alertas y eventos recientes', icon: 'notifications' };
  }

  if (route.path.includes('/residentes/') && route.path.endsWith('/historial')) {
    return { label: 'Historial de residente', subtitle: 'Cambios y trazabilidad', icon: 'history' };
  }

  if (route.path.startsWith('/residentes/nuevo')) {
    return { label: 'Nuevo residente', subtitle: 'Crea y vincula un residente', icon: 'person_add' };
  }

  if (route.path.includes('/residentes/') && route.path.endsWith('/editar')) {
    return { label: 'Editar residente', subtitle: 'Actualiza datos del residente', icon: 'edit' };
  }

  if (route.path.startsWith('/residentes')) {
    return { label: 'Residentes', subtitle: 'Padron y vinculos por casa', icon: 'groups' };
  }

  if (route.path.startsWith('/condominios')) {
    return { label: 'Condominios', subtitle: 'Gestion central de conjuntos', icon: 'apartment' };
  }

  if (route.path.startsWith('/administradores/nuevo')) {
    return { label: 'Nuevo administrador', subtitle: 'Alta de acceso administrativo', icon: 'person_add' };
  }

  if (route.path.includes('/administradores/') && route.path.endsWith('/editar')) {
    return { label: 'Editar administrador', subtitle: 'Actualiza permisos y acceso', icon: 'edit' };
  }

  if (route.path.startsWith('/administradores')) {
    return { label: 'Administradores', subtitle: 'Vista global de la plataforma', icon: 'manage_accounts' };
  }

  if (route.path.startsWith('/usuarios/nuevo')) {
    return { label: 'Nuevo usuario', subtitle: 'Crear cuenta manualmente', icon: 'person_add' };
  }

  if (route.path.includes('/usuarios/') && route.path.endsWith('/editar')) {
    return { label: 'Editar usuario', subtitle: 'Modificar acceso y datos', icon: 'edit' };
  }

  if (route.path.startsWith('/usuarios')) {
    return { label: 'Usuarios', subtitle: 'Listado de cuentas registradas', icon: 'groups' };
  }

  if (route.path.startsWith('/reportes')) {
    return { label: 'Reportes', subtitle: 'Indicadores y exportaciones', icon: 'analytics' };
  }

  if (route.path.startsWith('/configuracion')) {
    return { label: 'Configuracion', subtitle: 'Preferencias del sistema', icon: 'settings' };
  }

  if (route.path.startsWith('/admin/roles')) {
    return { label: 'Roles', subtitle: 'Permisos y accesos', icon: 'admin_panel_settings' };
  }

  return { label: 'Dashboard', subtitle: 'Resumen general de operacion', icon: 'dashboard' };
});

const drawerSections = computed<DrawerSection[]>(() => {
  const backendMenus = buildMenuTree(authStore.menus);

  if (backendMenus.length > 0) {
    return groupMenuTree(backendMenus);
  }

  return [
    {
      key: 'sin_permisos',
      items: [
        {
          key: 'sin_permisos_item',
          label: 'Sin permisos',
          icon: 'lock',
          sortOrder: 0,
          children: [],
        },
      ],
    },
  ];
});

function toggleLeftDrawer() {
  if ($q.screen.lt.md) {
    leftDrawerOpen.value = !leftDrawerOpen.value;
    return;
  }

  drawerMini.value = !drawerMini.value;
}

function goToNotifications() {
  void router.push('/notificaciones');
}

function goToProfile() {
  void router.push('/perfil');
}

function normalizeMenuPath(path?: string | null) {
  if (!path) {
    return undefined;
  }

  return path.startsWith('/') ? path : `/${path}`;
}

function groupMenuTree(items: NavMenuItem[]): DrawerSection[] {
  const groups: DrawerSection[] = [];

  items.forEach((item) => {
    if (item.children.length > 0) {
      groups.push({
        key: item.key,
        header: item.to ? item : undefined,
        label: item.to ? undefined : item.label,
        items: item.children,
      });
      return;
    }

    groups.push({
      key: item.key,
      items: [item],
    });
  });

  return groups;
}

function buildMenuTree(menus: AuthMenu[]): NavMenuItem[] {
  const flatMenus = flattenMenus(menus);
  const activeMenus = flatMenus.filter((item) => item.is_active);
  const itemsById = new Map<string, NavMenuItem>();

  activeMenus.forEach((item) => {
    const id = String(item.id);
    itemsById.set(id, {
      key: id,
      id,
      parentId: item.parent_id,
      label: item.label,
      icon: normalizeMenuIcon(item.icon),
      to: normalizeMenuPath(item.path),
      sortOrder: item.sort_order,
      children: [],
    });
  });

  const rootItems: NavMenuItem[] = [];

  activeMenus.forEach((item) => {
    const menuItem = itemsById.get(String(item.id));
    if (!menuItem) {
      return;
    }

    const parentId = item.parent_id === null || item.parent_id === 0 || item.parent_id === '0' ? null : String(item.parent_id);

    if (!parentId) {
      rootItems.push(menuItem);
      return;
    }

    const parent = itemsById.get(parentId);
    if (parent) {
      parent.children.push(menuItem);
      return;
    }

    rootItems.push(menuItem);
  });

  const sortMenus = (items: NavMenuItem[]) => {
    items.sort((first, second) => first.sortOrder - second.sortOrder);
    items.forEach((item) => sortMenus(item.children));
  };

  sortMenus(rootItems);
  return rootItems.filter((item) => !(item.parentId === null && !item.to && item.children.length === 0));
}

function flattenMenus(menus: AuthMenu[], parentId: number | string | null = null): AuthMenu[] {
  return menus.flatMap((menu) => {
    const normalizedMenu = {
      ...menu,
      parent_id: menu.parent_id ?? parentId,
    };

    return [normalizedMenu, ...flattenMenus(menu.children || [], menu.id)];
  });
}

async function handleLogout() {
  await signOut().catch(() => undefined);
  void router.push('/login');
}
</script>


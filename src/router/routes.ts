import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'dashboard', component: () => import('pages/DashboardPage.vue') },
      {
        path: '/admin/condominios',
        name: 'condominiums',
        component: () => import('pages/CondominiumsPage.vue'),
      },
      {
        path: '/admin/houses',
        alias: '/admin/casas',
        name: 'admin-houses',
        component: () => import('pages/AdminHousesPage.vue'),
      },
      {
        path: '/admin/casas/duenos/nuevo',
        name: 'create-house-owner',
        component: () => import('pages/CreateHouseOwnerPage.vue'),
      },
      {
        path: '/admin/residents',
        alias: '/admin/residentes',
        name: 'residents',
        component: () => import('pages/ResidentsPage.vue'),
      },
      {
        path: '/residentes/nuevo',
        name: 'create-resident',
        component: () => import('pages/CreateResidentPage.vue'),
      },
      {
        path: '/residentes/:id/editar',
        name: 'edit-resident',
        component: () => import('pages/EditResidentPage.vue'),
      },
      {
        path: 'condominios/nuevo',
        name: 'create-condominium',
        component: () => import('pages/CreateCondominiumPage.vue'),
      },
      {
        path: 'condominios/:id/editar',
        name: 'edit-condominium',
        component: () => import('pages/EditCondominiumPage.vue'),
      },
      {
        path: 'condominios/:id/administradores',
        name: 'condominium-administrators',
        component: () => import('pages/CondominiumAdministratorsPage.vue'),
      },
      {
        path: 'condominios/:id/casas',
        name: 'condominium-houses',
        component: () => import('pages/CondominiumHousesPage.vue'),
      },
      {
        path: 'administradores',
        name: 'administrators',
        component: () => import('pages/AdministratorsPage.vue'),
      },
      {
        path: 'administradores/nuevo',
        name: 'create-administrator',
        component: () => import('pages/CreateAdministratorPage.vue'),
      },
      {
        path: 'administradores/:id/editar',
        name: 'edit-administrator',
        component: () => import('pages/EditAdministratorPage.vue'),
      },
      { path: 'usuarios', name: 'users', component: () => import('pages/UsersPage.vue') },
      {
        path: 'usuarios/nuevo',
        name: 'create-user',
        component: () => import('pages/CreateUserPage.vue'),
      },
      {
        path: 'usuarios/:id/editar',
        name: 'edit-user',
        component: () => import('pages/EditUserPage.vue'),
      },
      { path: 'reportes', name: 'reports', component: () => import('pages/ReportsPage.vue') },
      {
        path: 'configuracion',
        name: 'settings',
        component: () => import('pages/SettingsPage.vue'),
      },
      { path: '/admin/roles', name: 'roles', component: () => import('pages/RolesPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

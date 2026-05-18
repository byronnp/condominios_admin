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
      { path: '', name: 'dashboard', component: () => import('pages/IndexPage.vue') },
      { path: 'condominios', name: 'condominiums', component: () => import('pages/CondominiumsPage.vue') },
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
      { path: 'administradores', name: 'administrators', component: () => import('pages/AdministratorsPage.vue') },
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
      { path: 'usuarios/nuevo', name: 'create-user', component: () => import('pages/CreateUserPage.vue') },
      { path: 'usuarios/:id/editar', name: 'edit-user', component: () => import('pages/EditUserPage.vue') },
      { path: 'reportes', name: 'reports', component: () => import('pages/ReportsPage.vue') },
      { path: 'configuracion', name: 'settings', component: () => import('pages/SettingsPage.vue') },
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

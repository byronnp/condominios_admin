import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('pages/auth/LoginPage.vue'),
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'dashboard', component: () => import('pages/dashboard/DashboardPage.vue') },
      {
        path: 'admin/condominios',
        name: 'adminCondominiums',
        component: () => import('pages/condominiums/CondominiumsPage.vue'),
      },
      {
        path: 'admin/houses',
        alias: 'admin/casas',
        name: 'adminHouses',
        component: () => import('pages/houses/AdminHousesPage.vue'),
      },
      {
        path: 'admin/casas/duenos/nuevo',
        name: 'createHouseOwner',
        component: () => import('pages/houses/CreateHouseOwnerPage.vue'),
      },
      {
        path: 'admin/residents',
        alias: 'admin/residentes',
        name: 'residents',
        component: () => import('pages/residents/ResidentsPage.vue'),
      },
      {
        path: 'residentes/nuevo',
        name: 'createResident',
        component: () => import('pages/residents/CreateResidentPage.vue'),
      },
      {
        path: 'residentes/:id/editar',
        name: 'editResident',
        component: () => import('pages/residents/EditResidentPage.vue'),
      },
      {
        path: 'condominios/nuevo',
        name: 'createCondominium',
        component: () => import('pages/condominiums/CreateCondominiumPage.vue'),
      },
      {
        path: 'condominios/:id/editar',
        name: 'editCondominium',
        component: () => import('pages/condominiums/EditCondominiumPage.vue'),
      },
      {
        path: 'condominios/:id/administradores',
        name: 'condominiumAdministrators',
        component: () => import('pages/condominiums/CondominiumAdministratorsPage.vue'),
      },
      {
        path: 'condominios/:id/casas',
        name: 'condominiumHouses',
        component: () => import('pages/condominiums/CondominiumHousesPage.vue'),
      },
      {
        path: 'administradores',
        name: 'administrators',
        component: () => import('pages/administrators/AdministratorsPage.vue'),
      },
      {
        path: 'administradores/nuevo',
        name: 'createAdministrator',
        component: () => import('pages/administrators/CreateAdministratorPage.vue'),
      },
      {
        path: 'administradores/:id/editar',
        name: 'editAdministrator',
        component: () => import('pages/administrators/EditAdministratorPage.vue'),
      },
      { path: 'usuarios', name: 'users', component: () => import('pages/users/UsersPage.vue') },
      {
        path: 'usuarios/nuevo',
        name: 'createUser',
        component: () => import('pages/users/CreateUserPage.vue'),
      },
      {
        path: 'usuarios/:id/editar',
        name: 'editUser',
        component: () => import('pages/users/EditUserPage.vue'),
      },
      {
        path: 'reportes',
        name: 'reports',
        component: () => import('pages/reports/ReportsPage.vue'),
      },
      {
        path: 'admin/payments',
        name: 'payments',
        component: () => import('pages/payments/PaymentsPage.vue'),
      },
      {
        path: 'admin/payments/:id',
        name: 'paymentDetail',
        component: () => import('pages/payments/PaymentDetailPage.vue'),
      },
      {
        path: '/resident/statement',
        name: 'accountStatement',
        component: () => import('pages/payments/AccountStatementPage.vue'),
      },
      {
        path: 'admin/fee-charges',
        name: 'fees',
        component: () => import('pages/fees/FeesPage.vue'),
      },
      {
        path: 'admin/invitaciones',
        name: 'invitations',
        component: () => import('pages/invitations/InvitationsPage.vue'),
      },
      {
        path: 'admin/comunicados',
        name: 'communications',
        component: () => import('pages/communications/CommunicationsPage.vue'),
      },
      {
        path: 'admin/solicitudes-mantenimiento',
        name: 'maintenanceRequests',
        component: () => import('pages/maintenance/MaintenanceRequestsPage.vue'),
      },
      {
        path: 'perfil',
        name: 'profile',
        component: () => import('pages/profile/ProfilePage.vue'),
      },
      {
        path: 'notificaciones',
        name: 'notifications',
        component: () => import('pages/notifications/NotificationsPage.vue'),
      },
      {
        path: 'notificaciones/:id',
        name: 'notificationDetail',
        component: () => import('pages/notifications/NotificationDetailPage.vue'),
      },
      {
        path: 'admin/casas/:id/historial',
        name: 'houseHistory',
        component: () => import('pages/houses/HouseHistoryPage.vue'),
      },
      {
        path: 'residentes/:id/historial',
        name: 'residentHistory',
        component: () => import('pages/residents/ResidentHistoryPage.vue'),
      },
      {
        path: 'configuracion',
        name: 'settings',
        component: () => import('pages/settings/SettingsPage.vue'),
      },
      { path: 'admin/roles', name: 'roles', component: () => import('pages/roles/RolesPage.vue') },
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

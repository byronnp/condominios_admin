<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">{{ dashboard.copy.eyebrow }}</p>
        <h1>{{ dashboard.copy.title }}</h1>
        <p>{{ dashboard.copy.description }}</p>
      </div>

      <div class="heading-actions">
        <q-btn outline color="primary" icon="filter_list" label="Filtrar" no-caps />
        <q-btn color="primary" :icon="dashboard.primaryAction.icon" :label="dashboard.primaryAction.label" no-caps />
      </div>
    </section>

    <section class="metric-grid">
      <article v-for="metric in dashboard.metrics" :key="metric.label" class="metric-card">
        <q-icon :name="metric.icon" class="metric-card__icon" />
        <span>{{ metric.label }}</span>
        <strong>{{ metric.value }}</strong>
        <small :class="metric.tone">{{ metric.detail }}</small>
      </article>
    </section>

    <section class="dashboard-grid">
      <div class="panel panel--large">
        <div class="panel-header">
          <div>
            <h2>{{ dashboard.mainPanel.title }}</h2>
            <p>{{ dashboard.mainPanel.subtitle }}</p>
          </div>
          <q-btn flat round icon="more_horiz" aria-label="Mas opciones" />
        </div>

        <q-list separator class="clean-list">
          <q-item v-for="item in dashboard.mainPanel.items" :key="item.title" class="activity-row">
            <q-item-section avatar>
              <q-avatar :color="item.color" text-color="white" :icon="item.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.title }}</q-item-label>
              <q-item-label caption>{{ item.caption }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-badge outline :color="item.color" :label="item.status" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <aside class="panel">
        <div class="panel-header">
          <div>
            <h2>{{ dashboard.sidePanel.title }}</h2>
            <p>{{ dashboard.sidePanel.subtitle }}</p>
          </div>
        </div>

        <div class="quick-actions">
          <q-btn
            v-for="action in dashboard.sidePanel.actions"
            :key="action.label"
            unelevated
            align="left"
            :icon="action.icon"
            :label="action.label"
            no-caps
            class="quick-action"
          />
        </div>
      </aside>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type UserRole = 'super-admin' | 'condo-admin' | 'resident';
type Tone = 'positive' | 'warning' | 'neutral';

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

const dashboard = computed(() => {
  const dashboards: Record<
    UserRole,
    {
      copy: { eyebrow: string; title: string; description: string };
      primaryAction: { label: string; icon: string };
      metrics: { label: string; value: string; detail: string; icon: string; tone: Tone }[];
      mainPanel: {
        title: string;
        subtitle: string;
        items: { title: string; caption: string; status: string; icon: string; color: string }[];
      };
      sidePanel: { title: string; subtitle: string; actions: { label: string; icon: string }[] };
    }
  > = {
    'super-admin': {
      copy: {
        eyebrow: 'Vista general',
        title: 'Control central de condominios',
        description: 'Supervisa condominios, administradores, usuarios y pagos desde una vista ejecutiva.',
      },
      primaryAction: { label: 'Nuevo condominio', icon: 'add_business' },
      metrics: [
        { label: 'Condominios activos', value: '18', detail: '+3 este mes', icon: 'apartment', tone: 'positive' },
        { label: 'Administradores', value: '26', detail: '4 por activar', icon: 'manage_accounts', tone: 'warning' },
        { label: 'Usuarios totales', value: '1.284', detail: '+8.2%', icon: 'groups', tone: 'positive' },
        { label: 'Pagos globales', value: '$48.760', detail: '92% recaudado', icon: 'payments', tone: 'neutral' },
      ],
      mainPanel: {
        title: 'Actividad de plataforma',
        subtitle: 'Eventos que requieren seguimiento del equipo central.',
        items: [
          { title: 'Condominio Altos del Valle creado', caption: 'Pendiente asignar administrador', status: 'Pendiente', icon: 'domain_add', color: 'warning' },
          { title: 'Mirador Norte alcanzo 96% de recaudacion', caption: 'Corte mensual de mayo', status: 'OK', icon: 'trending_up', color: 'positive' },
          { title: '3 administradores solicitaron acceso', caption: 'Revision de cuentas nuevas', status: 'Revision', icon: 'person_add', color: 'primary' },
        ],
      },
      sidePanel: {
        title: 'Acciones frecuentes',
        subtitle: 'Operaciones principales del super administrador.',
        actions: [
          { label: 'Registrar condominio', icon: 'add_business' },
          { label: 'Invitar administrador', icon: 'person_add' },
          { label: 'Ver reporte global', icon: 'analytics' },
        ],
      },
    },
    'condo-admin': {
      copy: {
        eyebrow: 'Operacion diaria',
        title: 'Gestion de Mirador Norte',
        description: 'Administra propiedades, residentes, pagos, invitados y comunicados del condominio.',
      },
      primaryAction: { label: 'Registrar pago', icon: 'add_card' },
      metrics: [
        { label: 'Propiedades', value: '84', detail: '79 ocupadas', icon: 'home_work', tone: 'neutral' },
        { label: 'Pagos pendientes', value: '16', detail: '$4.280 por cobrar', icon: 'receipt_long', tone: 'warning' },
        { label: 'Invitados hoy', value: '23', detail: '5 por confirmar', icon: 'badge', tone: 'warning' },
        { label: 'Solicitudes abiertas', value: '7', detail: '2 urgentes', icon: 'support_agent', tone: 'neutral' },
      ],
      mainPanel: {
        title: 'Pendientes del condominio',
        subtitle: 'Prioridades visibles para el administrador.',
        items: [
          { title: 'Casa B-14 reporto pago', caption: 'Comprobante pendiente de validacion', status: 'Validar', icon: 'payments', color: 'primary' },
          { title: 'Invitado de Torre A llega a las 18:00', caption: 'Acceso vehicular solicitado', status: 'Hoy', icon: 'directions_car', color: 'warning' },
          { title: 'Comunicado de mantenimiento programado', caption: 'Enviar a residentes antes de las 16:00', status: 'Borrador', icon: 'campaign', color: 'secondary' },
        ],
      },
      sidePanel: {
        title: 'Flujos rapidos',
        subtitle: 'Acciones operativas para reducir pasos.',
        actions: [
          { label: 'Crear residente', icon: 'person_add' },
          { label: 'Registrar invitado', icon: 'how_to_reg' },
          { label: 'Publicar comunicado', icon: 'campaign' },
        ],
      },
    },
    resident: {
      copy: {
        eyebrow: 'Mi vivienda',
        title: 'Resumen de Casa B-14',
        description: 'Consulta pagos, historial, invitados y novedades importantes de tu condominio.',
      },
      primaryAction: { label: 'Nuevo invitado', icon: 'person_add_alt' },
      metrics: [
        { label: 'Saldo pendiente', value: '$120', detail: 'Vence 31 mayo', icon: 'account_balance_wallet', tone: 'warning' },
        { label: 'Ultimo pago', value: '$120', detail: 'Pagado el 03 mayo', icon: 'check_circle', tone: 'positive' },
        { label: 'Invitados activos', value: '3', detail: '2 ingresan hoy', icon: 'badge', tone: 'neutral' },
        { label: 'Solicitudes', value: '1', detail: 'En revision', icon: 'support_agent', tone: 'neutral' },
      ],
      mainPanel: {
        title: 'Historial reciente',
        subtitle: 'Movimientos y eventos asociados a tu vivienda.',
        items: [
          { title: 'Pago de alicuota confirmado', caption: 'Mayo 2026 - Casa B-14', status: 'Pagado', icon: 'receipt', color: 'positive' },
          { title: 'Invitado: Daniel Perez', caption: 'Autorizado para hoy de 17:00 a 20:00', status: 'Activo', icon: 'badge', color: 'primary' },
          { title: 'Solicitud de mantenimiento', caption: 'Revision de luminaria exterior', status: 'Revision', icon: 'build', color: 'warning' },
        ],
      },
      sidePanel: {
        title: 'Accesos directos',
        subtitle: 'Tareas comunes del condomino.',
        actions: [
          { label: 'Ver estado de cuenta', icon: 'receipt_long' },
          { label: 'Registrar invitado', icon: 'person_add_alt' },
          { label: 'Crear solicitud', icon: 'support_agent' },
        ],
      },
    },
  };

  return dashboards[currentRole.value];
});
</script>

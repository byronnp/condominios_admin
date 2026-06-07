<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Notificaciones</p>
        <h1>Bandeja de avisos</h1>
        <p>Mockup de notificaciones para lectura rapida, filtrado y acciones de estado.</p>
      </div>

      <div class="heading-actions">
        <q-btn outline color="primary" icon="done_all" label="Marcar leidas" no-caps />
        <q-btn color="primary" icon="notifications" label="Nueva alerta" no-caps />
      </div>
    </section>

    <section class="metric-grid">
      <article v-for="metric in metrics" :key="metric.label" class="metric-card metric-card--compact">
        <q-icon :name="metric.icon" class="metric-card__icon" />
        <span>{{ metric.label }}</span>
        <strong>{{ metric.value }}</strong>
        <small :class="metric.tone">{{ metric.detail }}</small>
      </article>
    </section>

    <section class="dashboard-grid">
      <div class="panel panel--large data-panel">
        <div class="panel-header">
          <div>
            <h2>Bandeja principal</h2>
            <p>Mensajes del sistema, avisos y alertas operativas.</p>
          </div>
          <q-chip outline color="primary" icon="dashboard_customize" label="Mockup visual" />
        </div>

        <div class="table-toolbar">
          <q-input v-model="filter" outlined dense debounce="250" placeholder="Buscar aviso o condominio" class="soft-input table-toolbar__search">
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <div class="table-toolbar__filters">
            <q-select
              v-model="filterType"
              outlined
              dense
              emit-value
              map-options
              option-value="value"
              option-label="label"
              :options="typeOptions"
              label="Tipo"
              class="soft-input"
            />
          </div>
        </div>

        <q-list separator class="clean-list notification-list">
          <q-item v-for="item in filteredRows" :key="item.id" class="notification-item">
            <q-item-section avatar>
              <q-avatar :color="item.color" text-color="white" :icon="item.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">{{ item.title }}</q-item-label>
              <q-item-label caption>{{ item.message }}</q-item-label>
              <q-item-label caption>{{ item.meta }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-badge :color="item.badgeColor" :label="item.badge" class="status-badge" />
              <div class="row-actions row-actions--mobile q-mt-sm">
                <q-btn flat round dense color="primary" icon="done">
                  <q-tooltip>Marcar leida</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="primary" icon="visibility" @click="goToNotificationDetail(item)">
                  <q-tooltip>Ver detalle</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="negative" icon="delete">
                  <q-tooltip>Eliminar aviso</q-tooltip>
                </q-btn>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <aside class="panel">
        <div class="panel-header">
          <div>
            <h2>Centro de alertas</h2>
            <p>Bloque lateral para acompañar el mockup.</p>
          </div>
        </div>

        <q-banner rounded class="bg-blue-1 text-primary q-mb-md">
          La bandeja puede evolucionar hacia un centro de notificaciones en tiempo real.
        </q-banner>

        <q-list separator class="clean-list">
          <q-item v-for="item in sidebarItems" :key="item.label" class="summary-row">
            <q-item-section avatar>
              <q-avatar :icon="item.icon" color="primary" text-color="white" size="36px" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.label }}</q-item-label>
              <q-item-label caption>{{ item.caption }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </aside>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

type NotificationRow = {
  id: number;
  title: string;
  message: string;
  meta: string;
  type: 'Sistema' | 'Pago' | 'Mantenimiento' | 'Comunicado';
  icon: string;
  color: string;
  badge: string;
  badgeColor: string;
};

const filter = ref('');
const filterType = ref<'all' | NotificationRow['type']>('all');
const router = useRouter();

const metrics = [
  { label: 'Sin leer', value: '12', detail: 'Requieren atencion', icon: 'notifications_active', tone: 'warning' },
  { label: 'Hoy', value: '8', detail: 'Recibidas hoy', icon: 'today', tone: 'positive' },
  { label: 'Urgentes', value: '3', detail: 'Altas prioridades', icon: 'report', tone: 'negative' },
  { label: 'Leidas', value: '51', detail: 'Archivadas', icon: 'done_all', tone: 'positive' },
];

const rows: NotificationRow[] = [
  { id: 1, title: 'Pago registrado en B-14', message: 'La casa B-14 reporto un nuevo pago y espera confirmacion.', meta: 'Hoy 08:42 - Mirador Norte', type: 'Pago', icon: 'payments', color: 'primary', badge: 'Nuevo', badgeColor: 'primary' },
  { id: 2, title: 'Corte de agua programado', message: 'Mantenimiento notifica suspension temporal por 2 horas.', meta: 'Ayer 17:20 - Portal del Bosque', type: 'Mantenimiento', icon: 'water_drop', color: 'warning', badge: 'Importante', badgeColor: 'warning' },
  { id: 3, title: 'Comunicado publicado', message: 'Se envio un comunicado a residentes sobre limpieza de areas comunes.', meta: 'Hoy 10:15 - Global', type: 'Comunicado', icon: 'campaign', color: 'secondary', badge: 'Leido', badgeColor: 'positive' },
  { id: 4, title: 'Sesion iniciada desde nuevo dispositivo', message: 'El usuario principal ingreso desde una laptop no registrada.', meta: 'Hoy 06:55 - Seguridad', type: 'Sistema', icon: 'security', color: 'negative', badge: 'Atencion', badgeColor: 'negative' },
];

const typeOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Sistema', value: 'Sistema' },
  { label: 'Pago', value: 'Pago' },
  { label: 'Mantenimiento', value: 'Mantenimiento' },
  { label: 'Comunicado', value: 'Comunicado' },
];

const filteredRows = computed(() => {
  const query = filter.value.trim().toLowerCase();
  return rows.filter((row) => {
    const matchesQuery =
      !query ||
      [row.title, row.message, row.meta, row.type].join(' ').toLowerCase().includes(query);
    const matchesType = filterType.value === 'all' || row.type === filterType.value;
    return matchesQuery && matchesType;
  });
});

const sidebarItems = [
  { icon: 'mark_email_read', label: 'Lectura rapida', caption: 'Visualiza avisos y responde en segundos' },
  { icon: 'filter_alt', label: 'Filtros', caption: 'Sistema, pago, mantenimiento y comunicados' },
  { icon: 'notifications', label: 'Estado', caption: 'Leidas, nuevas y urgentes' },
];

function goToNotificationDetail(row: NotificationRow) {
  void router.push(`/notificaciones/${row.id}`);
}
</script>

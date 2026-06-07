<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Comunicados</p>
        <h1>Mensajes y notificaciones</h1>
        <p>Mockup para anuncios generales, envios programados y avisos urgentes.</p>
      </div>

      <div class="heading-actions">
        <q-btn outline color="primary" icon="refresh" label="Recargar" no-caps />
        <q-btn color="primary" icon="campaign" label="Nuevo comunicado" no-caps />
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
            <h2>Comunicados recientes</h2>
            <p>Vista de borradores, programados y enviados.</p>
          </div>
          <q-chip outline color="primary" icon="dashboard_customize" label="Mockup visual" />
        </div>

        <div class="table-toolbar">
          <q-input
            v-model="filter"
            outlined
            dense
            debounce="250"
            placeholder="Buscar titulo o audiencia"
            class="soft-input table-toolbar__search"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <q-table
          flat
          :rows="filteredRows"
          :columns="columns"
          row-key="id"
          :filter="filter"
          :grid="$q.screen.lt.md"
          :pagination="{ rowsPerPage: 6 }"
          class="soft-table"
        >
          <template #body-cell-title="props">
            <q-td :props="props">
              <div class="condo-cell">
                <q-avatar color="primary" text-color="white" size="38px">
                  {{ props.row.icon }}
                </q-avatar>
                <div>
                  <strong>{{ props.row.title }}</strong>
                  <span>{{ props.row.audience }}</span>
                </div>
              </div>
            </q-td>
          </template>

          <template #body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="props.row.statusColor" :label="props.row.status" class="status-badge" />
            </q-td>
          </template>

          <template #body-cell-actions="props">
            <q-td :props="props">
              <div class="row-actions">
                <q-btn flat round dense color="primary" icon="send">
                  <q-tooltip>Enviar ahora</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="primary" icon="edit">
                  <q-tooltip>Editar comunicado</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="negative" icon="delete">
                  <q-tooltip>Eliminar comunicado</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>

          <template #item="props">
            <div class="condo-grid-card">
              <div class="condo-grid-card__header">
                <div class="condo-cell">
                  <q-avatar color="primary" text-color="white" size="38px">
                    {{ props.row.icon }}
                  </q-avatar>
                  <div>
                    <strong>{{ props.row.title }}</strong>
                    <span>{{ props.row.audience }}</span>
                  </div>
                </div>
                <q-badge :color="props.row.statusColor" :label="props.row.status" class="status-badge" />
              </div>

              <div class="condo-grid-card__details">
                <span>Canal<strong>{{ props.row.channel }}</strong></span>
                <span>Programado<strong>{{ props.row.schedule }}</strong></span>
                <span>Prioridad<strong>{{ props.row.priority }}</strong></span>
                <span>Lecturas<strong>{{ props.row.readCount }}</strong></span>
              </div>

              <div class="row-actions row-actions--mobile">
                <q-btn flat round dense color="primary" icon="send">
                  <q-tooltip>Enviar ahora</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="primary" icon="edit">
                  <q-tooltip>Editar comunicado</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="negative" icon="delete">
                  <q-tooltip>Eliminar comunicado</q-tooltip>
                </q-btn>
              </div>
            </div>
          </template>
        </q-table>
      </div>

      <aside class="panel">
        <div class="panel-header">
          <div>
            <h2>Canales y alcance</h2>
            <p>Bloque lateral para explicar el mockup.</p>
          </div>
        </div>

        <q-banner rounded class="bg-blue-1 text-primary q-mb-md">
          Esta pantalla podra agrupar anuncios, notificaciones push y comunicados por audiencia.
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
import { useQuasar, type QTableColumn } from 'quasar';

type CommunicationRow = {
  id: number;
  title: string;
  icon: string;
  audience: string;
  channel: string;
  schedule: string;
  priority: string;
  readCount: string;
  status: 'Borrador' | 'Programado' | 'Enviado';
  statusColor: string;
};

const $q = useQuasar();
const filter = ref('');

const metrics = [
  { label: 'Enviados', value: '38', detail: 'Este mes', icon: 'send', tone: 'positive' },
  { label: 'Leidos', value: '1.082', detail: 'Tasa del 84%', icon: 'done_all', tone: 'positive' },
  { label: 'Programados', value: '6', detail: 'Siguientes 48h', icon: 'schedule', tone: 'warning' },
  { label: 'Borradores', value: '4', detail: 'Listos para revisión', icon: 'draft', tone: 'neutral' },
];

const rows: CommunicationRow[] = [
  { id: 1, title: 'Mantenimiento de piscina', icon: 'pool', audience: 'Mirador Norte', channel: 'App + correo', schedule: 'Hoy 18:00', priority: 'Alta', readCount: '78%', status: 'Programado', statusColor: 'warning' },
  { id: 2, title: 'Corte de energia', icon: 'flash_on', audience: 'Las Cumbres', channel: 'Push', schedule: 'Enviado', priority: 'Critica', readCount: '91%', status: 'Enviado', statusColor: 'positive' },
  { id: 3, title: 'Ajuste de horario de piscina', icon: 'schedule', audience: 'Portal del Bosque', channel: 'App', schedule: 'Pendiente', priority: 'Media', readCount: '0%', status: 'Borrador', statusColor: 'grey' },
  { id: 4, title: 'Aviso de fumigacion', icon: 'bug_report', audience: 'Riberas del Austro', channel: 'Correo', schedule: 'Mañana 07:00', priority: 'Alta', readCount: '63%', status: 'Programado', statusColor: 'warning' },
];

const columns: QTableColumn<CommunicationRow>[] = [
  { name: 'title', label: 'Comunicado', field: 'title', align: 'left', sortable: true },
  { name: 'audience', label: 'Audiencia', field: 'audience', align: 'left', sortable: true },
  { name: 'channel', label: 'Canal', field: 'channel', align: 'left', sortable: true },
  { name: 'schedule', label: 'Programacion', field: 'schedule', align: 'left', sortable: true },
  { name: 'status', label: 'Estado', field: 'status', align: 'left', sortable: true },
  { name: 'actions', label: 'Acciones', field: 'id', align: 'right' },
];

const filteredRows = computed(() => {
  const query = filter.value.trim().toLowerCase();
  return rows.filter((row) =>
    !query ||
    [row.title, row.audience, row.channel, row.schedule, row.status]
      .join(' ')
      .toLowerCase()
      .includes(query),
  );
});

const sidebarItems = [
  { icon: 'devices', label: 'Multicanal', caption: 'Correo, push y banner interno' },
  { icon: 'groups', label: 'Segmentacion', caption: 'Por condominio, casa o audiencia global' },
  { icon: 'schedule_send', label: 'Programacion', caption: 'Envia comunicaciones sin salir del panel' },
];
</script>

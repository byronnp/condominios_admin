<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Mantenimiento</p>
        <h1>Solicitudes y seguimiento</h1>
        <p>Mockup para tickets de mantenimiento, prioridad y asignacion operativa.</p>
      </div>

      <div class="heading-actions">
        <q-btn outline color="primary" icon="refresh" label="Recargar" no-caps />
        <q-btn color="primary" icon="build" label="Nueva solicitud" no-caps />
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
            <h2>Solicitudes abiertas</h2>
            <p>Cola de trabajo para el equipo operativo del condominio.</p>
          </div>
          <q-chip outline color="primary" icon="dashboard_customize" label="Mockup visual" />
        </div>

        <div class="table-toolbar">
          <q-input
            v-model="filter"
            outlined
            dense
            debounce="250"
            placeholder="Buscar solicitud, casa o condominio"
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
          <template #body-cell-ticket="props">
            <q-td :props="props">
              <div class="condo-cell">
                <q-avatar color="primary" text-color="white" size="38px">
                  {{ props.row.ticketCode }}
                </q-avatar>
                <div>
                  <strong>{{ props.row.ticketCode }}</strong>
                  <span>{{ props.row.category }}</span>
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
                <q-btn flat round dense color="primary" icon="assignment_turned_in">
                  <q-tooltip>Marcar avance</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="primary" icon="edit">
                  <q-tooltip>Editar solicitud</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="negative" icon="delete">
                  <q-tooltip>Eliminar solicitud</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>

          <template #item="props">
            <div class="condo-grid-card">
              <div class="condo-grid-card__header">
                <div class="condo-cell">
                  <q-avatar color="primary" text-color="white" size="38px">
                    {{ props.row.ticketCode }}
                  </q-avatar>
                  <div>
                    <strong>{{ props.row.request }}</strong>
                    <span>{{ props.row.condominium }} - {{ props.row.houseCode }}</span>
                  </div>
                </div>
                <q-badge :color="props.row.statusColor" :label="props.row.status" class="status-badge" />
              </div>

              <div class="condo-grid-card__details">
                <span>Categoria<strong>{{ props.row.category }}</strong></span>
                <span>Prioridad<strong>{{ props.row.priority }}</strong></span>
                <span>Asignado a<strong>{{ props.row.assignedTo }}</strong></span>
                <span>Fecha<strong>{{ props.row.date }}</strong></span>
              </div>

              <div class="row-actions row-actions--mobile">
                <q-btn flat round dense color="primary" icon="assignment_turned_in">
                  <q-tooltip>Marcar avance</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="primary" icon="edit">
                  <q-tooltip>Editar solicitud</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="negative" icon="delete">
                  <q-tooltip>Eliminar solicitud</q-tooltip>
                </q-btn>
              </div>
            </div>
          </template>
        </q-table>
      </div>

      <aside class="panel">
        <div class="panel-header">
          <div>
            <h2>Seguimiento</h2>
            <p>Bloque lateral para ilustrar el flujo del mockup.</p>
          </div>
        </div>

        <q-banner rounded class="bg-blue-1 text-primary q-mb-md">
          Las solicitudes de mantenimiento pueden convertirse en un modulo propio con estados, comentarios y adjuntos.
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

type MaintenanceRow = {
  id: number;
  ticketCode: string;
  request: string;
  condominium: string;
  houseCode: string;
  category: string;
  priority: string;
  assignedTo: string;
  date: string;
  status: 'Abierta' | 'En curso' | 'Resuelta' | 'Urgente';
  statusColor: string;
};

const $q = useQuasar();
const filter = ref('');

const metrics = [
  { label: 'Abiertas', value: '11', detail: 'Esperando asignacion', icon: 'assignment', tone: 'warning' },
  { label: 'Urgentes', value: '3', detail: 'Requieren atencion', icon: 'priority_high', tone: 'negative' },
  { label: 'En curso', value: '7', detail: 'Técnicos activos', icon: 'engineering', tone: 'positive' },
  { label: 'Resueltas', value: '24', detail: 'Cerradas hoy', icon: 'verified', tone: 'positive' },
];

const rows: MaintenanceRow[] = [
  { id: 1, ticketCode: 'MT-014', request: 'Fuga en ducha principal', condominium: 'Mirador Norte', houseCode: 'B-14', category: 'Plomeria', priority: 'Alta', assignedTo: 'Equipo interno', date: 'Hoy', status: 'Urgente', statusColor: 'negative' },
  { id: 2, ticketCode: 'MT-021', request: 'Luminaria exterior dañada', condominium: 'Las Cumbres', houseCode: 'A-07', category: 'Electricidad', priority: 'Media', assignedTo: 'Juan Torres', date: 'Ayer', status: 'En curso', statusColor: 'primary' },
  { id: 3, ticketCode: 'MT-032', request: 'Puerta de acceso con ruido', condominium: 'Portal del Bosque', houseCode: '302', category: 'Infraestructura', priority: 'Baja', assignedTo: 'Pendiente', date: 'Hoy', status: 'Abierta', statusColor: 'warning' },
  { id: 4, ticketCode: 'MT-044', request: 'Limpieza de cisterna', condominium: 'Riberas del Austro', houseCode: 'C-11', category: 'Mantenimiento', priority: 'Media', assignedTo: 'Brigada externa', date: '2 dias', status: 'Resuelta', statusColor: 'positive' },
];

const columns: QTableColumn<MaintenanceRow>[] = [
  { name: 'ticket', label: 'Ticket', field: 'ticketCode', align: 'left', sortable: true },
  { name: 'request', label: 'Solicitud', field: 'request', align: 'left', sortable: true },
  { name: 'category', label: 'Categoria', field: 'category', align: 'left', sortable: true },
  { name: 'priority', label: 'Prioridad', field: 'priority', align: 'left', sortable: true },
  { name: 'status', label: 'Estado', field: 'status', align: 'left', sortable: true },
  { name: 'actions', label: 'Acciones', field: 'id', align: 'right' },
];

const filteredRows = computed(() => {
  const query = filter.value.trim().toLowerCase();
  return rows.filter((row) =>
    !query ||
    [row.ticketCode, row.request, row.condominium, row.houseCode, row.category, row.priority, row.status]
      .join(' ')
      .toLowerCase()
      .includes(query),
  );
});

const sidebarItems = [
  { icon: 'build', label: 'Asignacion', caption: 'Pasar de abierta a en curso o resuelta' },
  { icon: 'comment', label: 'Comentarios', caption: 'Agregar observaciones al ticket' },
  { icon: 'attach_file', label: 'Adjuntos', caption: 'Fotos o evidencias de la solicitud' },
];
</script>

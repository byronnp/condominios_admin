<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Invitaciones</p>
        <h1>Accesos y visitas</h1>
        <p>Mockup para el flujo de invitaciones a casas y control temporal de acceso.</p>
      </div>

      <div class="heading-actions">
        <q-btn outline color="primary" icon="refresh" label="Recargar" no-caps />
        <q-btn color="primary" icon="person_add" label="Nueva invitacion" no-caps />
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
            <h2>Invitaciones activas</h2>
            <p>Estado visual de autorizaciones, ventana horaria y visitante.</p>
          </div>
          <q-chip outline color="primary" icon="dashboard_customize" label="Mockup visual" />
        </div>

        <div class="table-toolbar">
          <q-input
            v-model="filter"
            outlined
            dense
            debounce="250"
            placeholder="Buscar visitante, casa o condominio"
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
          <template #body-cell-house="props">
            <q-td :props="props">
              <div class="condo-cell">
                <q-avatar color="primary" text-color="white" size="38px">
                  {{ props.row.houseCode }}
                </q-avatar>
                <div>
                  <strong>{{ props.row.houseCode }}</strong>
                  <span>{{ props.row.condominium }}</span>
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
                <q-btn flat round dense color="primary" icon="qr_code_2">
                  <q-tooltip>Mostrar QR</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="primary" icon="edit">
                  <q-tooltip>Editar invitacion</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="negative" icon="delete">
                  <q-tooltip>Eliminar invitacion</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>

          <template #item="props">
            <div class="condo-grid-card">
              <div class="condo-grid-card__header">
                <div class="condo-cell">
                  <q-avatar color="primary" text-color="white" size="38px">
                    {{ props.row.guestInitials }}
                  </q-avatar>
                  <div>
                    <strong>{{ props.row.guest }}</strong>
                    <span>{{ props.row.houseCode }} - {{ props.row.condominium }}</span>
                  </div>
                </div>
                <q-badge :color="props.row.statusColor" :label="props.row.status" class="status-badge" />
              </div>

              <div class="condo-grid-card__details">
                <span>Ventana<strong>{{ props.row.timeWindow }}</strong></span>
                <span>Tipo<strong>{{ props.row.accessType }}</strong></span>
                <span>Solicitado por<strong>{{ props.row.host }}</strong></span>
                <span>Fecha<strong>{{ props.row.date }}</strong></span>
              </div>

              <div class="row-actions row-actions--mobile">
                <q-btn flat round dense color="primary" icon="qr_code_2">
                  <q-tooltip>Mostrar QR</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="primary" icon="edit">
                  <q-tooltip>Editar invitacion</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="negative" icon="delete">
                  <q-tooltip>Eliminar invitacion</q-tooltip>
                </q-btn>
              </div>
            </div>
          </template>
        </q-table>
      </div>

      <aside class="panel">
        <div class="panel-header">
          <div>
            <h2>Control temporal</h2>
            <p>Bloque lateral para completar el mockup de accesos.</p>
          </div>
        </div>

        <q-banner rounded class="bg-blue-1 text-primary q-mb-md">
          La invitacion deberia resolverse con un QR o un pase temporal en una siguiente iteracion.
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

type InvitationRow = {
  id: number;
  guest: string;
  guestInitials: string;
  host: string;
  condominium: string;
  houseCode: string;
  accessType: string;
  timeWindow: string;
  date: string;
  status: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'Activa';
  statusColor: string;
};

const $q = useQuasar();
const filter = ref('');

const metrics = [
  { label: 'Pendientes', value: '14', detail: 'Esperando aprobacion', icon: 'schedule', tone: 'warning' },
  { label: 'Aprobadas hoy', value: '23', detail: 'Ingresos del dia', icon: 'verified', tone: 'positive' },
  { label: 'Activas', value: '8', detail: 'Dentro de la ventana', icon: 'badge', tone: 'primary' },
  { label: 'Rechazadas', value: '3', detail: 'Requieren revision', icon: 'cancel', tone: 'negative' },
];

const rows: InvitationRow[] = [
  { id: 1, guest: 'Carlos Mena', guestInitials: 'CM', host: 'Daniel Perez', condominium: 'Mirador Norte', houseCode: 'B-14', accessType: 'Vehicular', timeWindow: '17:00 - 20:00', date: 'Hoy', status: 'Activa', statusColor: 'positive' },
  { id: 2, guest: 'Andrea Ruiz', guestInitials: 'AR', host: 'Lucia Castro', condominium: 'Portal del Bosque', houseCode: '302', accessType: 'Peatonal', timeWindow: '09:00 - 11:00', date: 'Mañana', status: 'Pendiente', statusColor: 'warning' },
  { id: 3, guest: 'Javier Silva', guestInitials: 'JS', host: 'Ana Vera', condominium: 'Riberas del Austro', houseCode: 'C-11', accessType: 'Ambos', timeWindow: '14:00 - 18:00', date: 'Hoy', status: 'Aprobada', statusColor: 'primary' },
  { id: 4, guest: 'Marta Diaz', guestInitials: 'MD', host: 'Rafael Mora', condominium: 'Las Cumbres', houseCode: 'A-07', accessType: 'Peatonal', timeWindow: 'Cancelada', date: 'Ayer', status: 'Rechazada', statusColor: 'negative' },
];

const columns: QTableColumn<InvitationRow>[] = [
  { name: 'house', label: 'Casa', field: 'houseCode', align: 'left', sortable: true },
  { name: 'guest', label: 'Visitante', field: 'guest', align: 'left', sortable: true },
  { name: 'host', label: 'Solicitado por', field: 'host', align: 'left', sortable: true },
  { name: 'timeWindow', label: 'Ventana', field: 'timeWindow', align: 'left', sortable: true },
  { name: 'status', label: 'Estado', field: 'status', align: 'left', sortable: true },
  { name: 'actions', label: 'Acciones', field: 'id', align: 'right' },
];

const filteredRows = computed(() => {
  const query = filter.value.trim().toLowerCase();
  return rows.filter((row) =>
    !query ||
    [row.guest, row.host, row.condominium, row.houseCode, row.timeWindow, row.status]
      .join(' ')
      .toLowerCase()
      .includes(query),
  );
});

const sidebarItems = [
  { icon: 'qr_code_2', label: 'Pase temporal', caption: 'La invitacion puede derivar en QR o codigo' },
  { icon: 'access_time', label: 'Ventana de acceso', caption: 'Bloque temporal configurable por vivienda' },
  { icon: 'shield', label: 'Validacion', caption: 'Ideal para recepcion y control de ingreso' },
];
</script>

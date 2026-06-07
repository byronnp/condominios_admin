<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Alicuotas</p>
        <h1>Cuotas y periodos</h1>
        <p>Mockup para definir cuotas vigentes, periodos y estado de vencimiento.</p>
      </div>

      <div class="heading-actions">
        <q-btn outline color="primary" icon="refresh" label="Recargar" no-caps />
        <q-btn color="primary" icon="add_circle" label="Nueva cuota" no-caps />
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
            <h2>Cuotas activas</h2>
            <p>Vista operativa para revisar montos y vigencias.</p>
          </div>
          <q-chip outline color="primary" icon="dashboard_customize" label="Mockup visual" />
        </div>

        <div class="table-toolbar">
          <q-input
            v-model="filter"
            outlined
            dense
            debounce="250"
            placeholder="Buscar condominio o periodo"
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
          <template #body-cell-condominium="props">
            <q-td :props="props">
              <div class="condo-cell">
                <q-avatar color="primary" text-color="white" size="38px">
                  {{ props.row.shortName }}
                </q-avatar>
                <div>
                  <strong>{{ props.row.condominium }}</strong>
                  <span>{{ props.row.period }}</span>
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
                <q-btn flat round dense color="primary" icon="edit">
                  <q-tooltip>Editar cuota</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="primary" icon="history">
                  <q-tooltip>Ver historial</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="negative" icon="delete">
                  <q-tooltip>Eliminar cuota</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>

          <template #item="props">
            <div class="condo-grid-card">
              <div class="condo-grid-card__header">
                <div class="condo-cell">
                  <q-avatar color="primary" text-color="white" size="38px">
                    {{ props.row.shortName }}
                  </q-avatar>
                  <div>
                    <strong>{{ props.row.condominium }}</strong>
                    <span>{{ props.row.period }}</span>
                  </div>
                </div>
                <q-badge :color="props.row.statusColor" :label="props.row.status" class="status-badge" />
              </div>

              <div class="condo-grid-card__details">
                <span>Cuota<strong>{{ props.row.amount }}</strong></span>
                <span>Vencimiento<strong>{{ props.row.dueDate }}</strong></span>
                <span>Aplicados<strong>{{ props.row.units }}</strong></span>
                <span>Tipo<strong>{{ props.row.type }}</strong></span>
              </div>

              <div class="row-actions row-actions--mobile">
                <q-btn flat round dense color="primary" icon="edit">
                  <q-tooltip>Editar cuota</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="primary" icon="history">
                  <q-tooltip>Ver historial</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="negative" icon="delete">
                  <q-tooltip>Eliminar cuota</q-tooltip>
                </q-btn>
              </div>
            </div>
          </template>
        </q-table>
      </div>

      <aside class="panel">
        <div class="panel-header">
          <div>
            <h2>Configuracion base</h2>
            <p>Panel lateral para explicar el mockup de cuotas.</p>
          </div>
        </div>

        <q-banner rounded class="bg-blue-1 text-primary q-mb-md">
          Las cuotas y periodos aun no estan conectados al backend. Esta vista solo define la interfaz.
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

type FeeRow = {
  id: number;
  shortName: string;
  condominium: string;
  period: string;
  amount: string;
  dueDate: string;
  units: string;
  type: string;
  status: 'Vigente' | 'Por vencer' | 'Vencida';
  statusColor: string;
};

const $q = useQuasar();
const filter = ref('');

const metrics = [
  { label: 'Cuotas vigentes', value: '18', detail: 'Sin retraso', icon: 'receipt_long', tone: 'positive' },
  { label: 'Por vencer', value: '6', detail: 'Proximos 7 dias', icon: 'schedule', tone: 'warning' },
  { label: 'Vencidas', value: '4', detail: 'Requieren revision', icon: 'report', tone: 'negative' },
  { label: 'Recaudacion estimada', value: '$24.400', detail: 'Mes actual', icon: 'payments', tone: 'positive' },
];

const rows: FeeRow[] = [
  { id: 1, shortName: 'MN', condominium: 'Mirador Norte', period: 'Mayo 2026', amount: '$120', dueDate: '31 mayo', units: '84 casas', type: 'Ordinaria', status: 'Vigente', statusColor: 'positive' },
  { id: 2, shortName: 'PB', condominium: 'Portal del Bosque', period: 'Mayo 2026', amount: '$140', dueDate: '28 mayo', units: '64 casas', type: 'Ordinaria', status: 'Por vencer', statusColor: 'warning' },
  { id: 3, shortName: 'RC', condominium: 'Riberas del Austro', period: 'Abril 2026', amount: '$110', dueDate: '15 mayo', units: '58 casas', type: 'Extraordinaria', status: 'Vencida', statusColor: 'negative' },
  { id: 4, shortName: 'LC', condominium: 'Las Cumbres', period: 'Mayo 2026', amount: '$150', dueDate: '30 mayo', units: '96 casas', type: 'Ordinaria', status: 'Vigente', statusColor: 'primary' },
];

const columns: QTableColumn<FeeRow>[] = [
  { name: 'condominium', label: 'Condominio', field: 'condominium', align: 'left', sortable: true },
  { name: 'period', label: 'Periodo', field: 'period', align: 'left', sortable: true },
  { name: 'amount', label: 'Cuota', field: 'amount', align: 'left', sortable: true },
  { name: 'dueDate', label: 'Vencimiento', field: 'dueDate', align: 'left', sortable: true },
  { name: 'status', label: 'Estado', field: 'status', align: 'left', sortable: true },
  { name: 'actions', label: 'Acciones', field: 'id', align: 'right' },
];

const filteredRows = computed(() => {
  const query = filter.value.trim().toLowerCase();
  return rows.filter((row) =>
    !query ||
    [row.condominium, row.period, row.amount, row.status, row.type]
      .join(' ')
      .toLowerCase()
      .includes(query),
  );
});

const sidebarItems = [
  { icon: 'percent', label: 'Reglas por condominio', caption: 'Definir criterios por periodo' },
  { icon: 'calendar_month', label: 'Ventanas de cobro', caption: 'Cuotas con rangos y vencimientos' },
  { icon: 'attach_money', label: 'Ajustes rapidos', caption: 'Cambio de monto sin salir de la vista' },
];
</script>

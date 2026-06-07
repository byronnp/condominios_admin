<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Pagos</p>
        <h1>Recaudacion y conciliacion</h1>
        <p>Mockup del flujo de pagos por casa, condominio y estado de conciliacion.</p>
      </div>

      <div class="heading-actions">
        <q-btn outline color="primary" icon="refresh" label="Recargar" no-caps />
        <q-btn color="primary" icon="payments" label="Registrar pago" no-caps />
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
            <h2>Movimientos recientes</h2>
            <p>Listado visual para revisar pagos, metodo y estado.</p>
          </div>
          <q-chip outline color="primary" icon="dashboard_customize" label="Mockup visual" />
        </div>

        <div class="table-toolbar">
          <q-input
            v-model="filter"
            outlined
            dense
            debounce="250"
            placeholder="Buscar casa, condominio o residente"
            class="soft-input table-toolbar__search"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <div class="table-toolbar__filters">
            <q-select
              v-model="statusFilter"
              outlined
              dense
              emit-value
              map-options
              option-value="value"
              option-label="label"
              :options="statusOptions"
              label="Estado"
              class="soft-input"
            />
          </div>
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
                <q-btn flat round dense color="primary" icon="visibility" @click="goToPaymentDetail(props.row)">
                  <q-tooltip>Ver detalle</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="primary" icon="edit">
                  <q-tooltip>Editar pago</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="negative" icon="delete">
                  <q-tooltip>Eliminar registro</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>

          <template #item="props">
            <div class="condo-grid-card">
              <div class="condo-grid-card__header">
                <div class="condo-cell">
                  <q-avatar color="primary" text-color="white" size="38px">
                    {{ props.row.houseCode }}
                  </q-avatar>
                  <div>
                    <strong>{{ props.row.resident }}</strong>
                    <span>{{ props.row.condominium }}</span>
                  </div>
                </div>
                <q-badge :color="props.row.statusColor" :label="props.row.status" class="status-badge" />
              </div>

              <div class="condo-grid-card__details">
                <span>Casa<strong>{{ props.row.houseCode }}</strong></span>
                <span>Monto<strong>{{ props.row.amount }}</strong></span>
                <span>Metodo<strong>{{ props.row.method }}</strong></span>
                <span>Fecha<strong>{{ props.row.date }}</strong></span>
              </div>

              <div class="row-actions row-actions--mobile">
                <q-btn flat round dense color="primary" icon="visibility" @click="goToPaymentDetail(props.row)">
                  <q-tooltip>Ver detalle</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="primary" icon="edit">
                  <q-tooltip>Editar pago</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="negative" icon="delete">
                  <q-tooltip>Eliminar registro</q-tooltip>
                </q-btn>
              </div>
            </div>
          </template>
        </q-table>
      </div>

      <aside class="panel">
        <div class="panel-header">
          <div>
            <h2>Resumen operativo</h2>
            <p>Bloque lateral para guiar la lectura del mockup.</p>
          </div>
        </div>

        <q-banner rounded class="bg-blue-1 text-primary q-mb-md">
          Esta pantalla es un mockup visual. Falta conectar el backend de pagos y conciliacion.
        </q-banner>

        <q-list separator class="clean-list">
          <q-item v-for="item in summaryItems" :key="item.label" class="summary-row">
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
import { useRouter } from 'vue-router';

type PaymentRow = {
  id: number;
  houseCode: string;
  condominium: string;
  resident: string;
  amount: string;
  method: string;
  status: 'Pagado' | 'Pendiente' | 'Mora' | 'Conciliado';
  statusColor: string;
  date: string;
};

const $q = useQuasar();
const router = useRouter();
const filter = ref('');
const statusFilter = ref<'all' | PaymentRow['status']>('all');

const metrics = [
  { label: 'Recaudado', value: '$48.760', detail: '92% del mes', icon: 'payments', tone: 'positive' },
  { label: 'Pendientes', value: '16', detail: '10 por vencer', icon: 'schedule', tone: 'warning' },
  { label: 'Mora', value: '4', detail: 'Casos criticos', icon: 'report', tone: 'warning' },
  { label: 'Conciliados', value: '128', detail: 'Movimientos cerrados', icon: 'verified', tone: 'positive' },
];

const statusOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Pagado', value: 'Pagado' },
  { label: 'Pendiente', value: 'Pendiente' },
  { label: 'Mora', value: 'Mora' },
  { label: 'Conciliado', value: 'Conciliado' },
];

const rows: PaymentRow[] = [
  { id: 1, houseCode: 'B-14', condominium: 'Mirador Norte', resident: 'Daniel Perez', amount: '$120', method: 'Transferencia', status: 'Pagado', statusColor: 'positive', date: '03 mayo' },
  { id: 2, houseCode: 'A-07', condominium: 'Las Cumbres', resident: 'Rafael Mora', amount: '$120', method: 'Efectivo', status: 'Pendiente', statusColor: 'warning', date: '08 mayo' },
  { id: 3, houseCode: 'C-11', condominium: 'Riberas del Austro', resident: 'Ana Vera', amount: '$240', method: 'Tarjeta', status: 'Conciliado', statusColor: 'primary', date: '12 mayo' },
  { id: 4, houseCode: '302', condominium: 'Portal del Bosque', resident: 'Lucia Castro', amount: '$80', method: 'Transferencia', status: 'Mora', statusColor: 'negative', date: '14 mayo' },
];

const columns: QTableColumn<PaymentRow>[] = [
  { name: 'house', label: 'Casa', field: 'houseCode', align: 'left', sortable: true },
  { name: 'resident', label: 'Residente', field: 'resident', align: 'left', sortable: true },
  { name: 'amount', label: 'Monto', field: 'amount', align: 'left', sortable: true },
  { name: 'method', label: 'Metodo', field: 'method', align: 'left', sortable: true },
  { name: 'status', label: 'Estado', field: 'status', align: 'left', sortable: true },
  { name: 'date', label: 'Fecha', field: 'date', align: 'left', sortable: true },
  { name: 'actions', label: 'Acciones', field: 'id', align: 'right' },
];

const filteredRows = computed(() => {
  const query = filter.value.trim().toLowerCase();
  return rows.filter((row) => {
    const matchesSearch =
      !query ||
      [row.houseCode, row.condominium, row.resident, row.method, row.status]
        .join(' ')
        .toLowerCase()
        .includes(query);
    const matchesStatus = statusFilter.value === 'all' || row.status === statusFilter.value;
    return matchesSearch && matchesStatus;
  });
});

const summaryItems = [
  { icon: 'receipt_long', label: 'Conciliacion', caption: 'Revisar movimientos sin validar' },
  { icon: 'security', label: 'Pagos manuales', caption: 'Debe quedar claro el origen del registro' },
  { icon: 'campaign', label: 'Recordatorios', caption: 'Pantalla pensada para cobranza operativa' },
];

function goToPaymentDetail(row: PaymentRow) {
  void router.push(`/admin/pagos/${row.id}`);
}
</script>

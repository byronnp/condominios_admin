<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Estado de cuenta</p>
        <h1>{{ statementTitle }}</h1>
        <p>Mockup del resumen de cargos, pagos y saldo del residente o vivienda.</p>
      </div>

      <div class="heading-actions">
        <q-btn outline color="primary" icon="arrow_back" label="Volver" to="/admin/pagos" no-caps />
        <q-btn color="primary" icon="download" label="Exportar estado" no-caps />
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
            <h2>Movimientos del periodo</h2>
            <p>Cargos, pagos y saldo consolidado.</p>
          </div>
        </div>

        <q-table
          flat
          :rows="rows"
          :columns="columns"
          row-key="id"
          :pagination="{ rowsPerPage: 6 }"
          :grid="$q.screen.lt.md"
          class="soft-table"
        >
          <template #body-cell-concept="props">
            <q-td :props="props">
              <div class="condo-cell">
                <q-avatar color="primary" text-color="white" size="38px">
                  {{ props.row.shortCode }}
                </q-avatar>
                <div>
                  <strong>{{ props.row.concept }}</strong>
                  <span>{{ props.row.detail }}</span>
                </div>
              </div>
            </q-td>
          </template>

          <template #body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="props.row.statusColor" :label="props.row.status" class="status-badge" />
            </q-td>
          </template>

          <template #item="props">
            <div class="condo-grid-card">
              <div class="condo-grid-card__header">
                <div class="condo-cell">
                  <q-avatar color="primary" text-color="white" size="38px">
                    {{ props.row.shortCode }}
                  </q-avatar>
                  <div>
                    <strong>{{ props.row.concept }}</strong>
                    <span>{{ props.row.detail }}</span>
                  </div>
                </div>
                <q-badge :color="props.row.statusColor" :label="props.row.status" class="status-badge" />
              </div>

              <div class="condo-grid-card__details">
                <span>Debe<strong>{{ props.row.charge }}</strong></span>
                <span>Pagado<strong>{{ props.row.paid }}</strong></span>
                <span>Saldo<strong>{{ props.row.balance }}</strong></span>
                <span>Periodo<strong>{{ props.row.period }}</strong></span>
              </div>
            </div>
          </template>
        </q-table>
      </div>

      <aside class="panel">
        <div class="panel-header">
          <div>
            <h2>Resumen financiero</h2>
            <p>Bloque lateral con contexto del estado de cuenta.</p>
          </div>
        </div>

        <q-banner rounded class="bg-blue-1 text-primary q-mb-md">
          El estado de cuenta puede evolucionar a una vista con exportacion PDF y filtros por periodo.
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
import { computed } from 'vue';
import { useQuasar, type QTableColumn } from 'quasar';
import { useRoute } from 'vue-router';

type StatementRow = {
  id: number;
  shortCode: string;
  concept: string;
  detail: string;
  charge: string;
  paid: string;
  balance: string;
  period: string;
  status: 'Cargo' | 'Pago' | 'Saldo' | 'Ajuste';
  statusColor: string;
};

const route = useRoute();
const $q = useQuasar();
const statementTitle = computed(() => `Estado de cuenta ${String(route.params.id || 'Casa B-14')}`);

const metrics = [
  { label: 'Saldo', value: '$120', detail: 'Vence 31 mayo', icon: 'account_balance_wallet', tone: 'warning' },
  { label: 'Cargos', value: '$360', detail: 'Periodo actual', icon: 'receipt_long', tone: 'neutral' },
  { label: 'Pagado', value: '$240', detail: 'Conciliado parcial', icon: 'check_circle', tone: 'positive' },
  { label: 'Ajustes', value: '2', detail: 'Pendientes', icon: 'tune', tone: 'warning' },
];

const rows: StatementRow[] = [
  { id: 1, shortCode: 'A', concept: 'Alicuota ordinaria', detail: 'Mayo 2026', charge: '$120', paid: '$120', balance: '$0', period: 'Mayo', status: 'Pago', statusColor: 'positive' },
  { id: 2, shortCode: 'B', concept: 'Multa por mora', detail: 'Abril 2026', charge: '$20', paid: '$0', balance: '$20', period: 'Abril', status: 'Cargo', statusColor: 'negative' },
  { id: 3, shortCode: 'C', concept: 'Servicio extra', detail: 'Mayo 2026', charge: '$80', paid: '$40', balance: '$40', period: 'Mayo', status: 'Saldo', statusColor: 'warning' },
  { id: 4, shortCode: 'D', concept: 'Ajuste administrativo', detail: 'Mayo 2026', charge: '$0', paid: '$0', balance: '$0', period: 'Mayo', status: 'Ajuste', statusColor: 'primary' },
];

const columns: QTableColumn<StatementRow>[] = [
  { name: 'concept', label: 'Concepto', field: 'concept', align: 'left', sortable: true },
  { name: 'charge', label: 'Cargo', field: 'charge', align: 'left', sortable: true },
  { name: 'paid', label: 'Pagado', field: 'paid', align: 'left', sortable: true },
  { name: 'balance', label: 'Saldo', field: 'balance', align: 'left', sortable: true },
  { name: 'period', label: 'Periodo', field: 'period', align: 'left', sortable: true },
  { name: 'status', label: 'Estado', field: 'status', align: 'left', sortable: true },
];

const sidebarItems = [
  { icon: 'download', label: 'Exportacion', caption: 'PDF o Excel para entregar al residente' },
  { icon: 'calendar_month', label: 'Periodo', caption: 'Seleccion de mes o rango de facturacion' },
  { icon: 'payments', label: 'Saldo', caption: 'Resumen de cargos y pagos del periodo' },
];
</script>

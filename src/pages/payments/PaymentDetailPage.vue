<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Detalle de pago</p>
        <h1>{{ payment.reference }}</h1>
        <p>Mockup del detalle individual de un pago con trazabilidad y acciones.</p>
      </div>

      <div class="heading-actions">
        <q-btn outline color="primary" icon="arrow_back" label="Volver" to="/admin/pagos" no-caps />
        <q-btn color="primary" icon="edit" label="Editar pago" no-caps />
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

    <section class="create-layout">
      <div class="panel form-panel">
        <div class="panel-header">
          <div>
            <h2>Informacion del pago</h2>
            <p>Bloque principal del detalle mockup.</p>
          </div>
        </div>

        <div class="form-grid">
          <q-input v-model="payment.reference" outlined dense label="Referencia" class="soft-input" readonly />
          <q-input v-model="payment.condominium" outlined dense label="Condominio" class="soft-input" readonly />
          <q-input v-model="payment.house" outlined dense label="Casa" class="soft-input" readonly />
          <q-input v-model="payment.resident" outlined dense label="Residente" class="soft-input" readonly />
          <q-input v-model="payment.amount" outlined dense label="Monto" class="soft-input" readonly />
          <q-input v-model="payment.method" outlined dense label="Metodo" class="soft-input" readonly />
          <q-input v-model="payment.date" outlined dense label="Fecha" class="soft-input" readonly />
          <q-input v-model="payment.status" outlined dense label="Estado" class="soft-input" readonly />
        </div>
      </div>

      <aside class="panel summary-panel">
        <div class="panel-header">
          <div>
            <h2>Trazabilidad</h2>
            <p>Linea de tiempo y estado de conciliacion.</p>
          </div>
        </div>

        <q-banner rounded class="bg-blue-1 text-primary q-mb-md">
          Este detalle es un mockup visual. Todavia no esta conectado a un backend de pagos.
        </q-banner>

        <q-list separator class="clean-list">
          <q-item v-for="item in timeline" :key="item.label" class="summary-row">
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
import { reactive } from 'vue';

const metrics = [
  { label: 'Conciliacion', value: 'Pendiente', detail: 'Revision manual', icon: 'account_balance', tone: 'warning' },
  { label: 'Saldo', value: '$0', detail: 'Sin diferencia', icon: 'verified', tone: 'positive' },
  { label: 'Reversion', value: 'No', detail: 'Sin ajuste', icon: 'undo', tone: 'neutral' },
  { label: 'Soporte', value: '1', detail: 'Ticket asociado', icon: 'support_agent', tone: 'warning' },
];

const payment = reactive({
  reference: 'PAY-0142',
  condominium: 'Mirador Norte',
  house: 'B-14',
  resident: 'Daniel Perez',
  amount: '$120',
  method: 'Transferencia',
  date: '03 mayo 2026',
  status: 'Pagado',
});

const timeline = [
  { icon: 'send', label: 'Emitido', caption: '03 mayo 08:10' },
  { icon: 'payments', label: 'Registrado', caption: '03 mayo 08:42' },
  { icon: 'verified', label: 'Conciliacion', caption: 'Pendiente de validacion' },
];
</script>

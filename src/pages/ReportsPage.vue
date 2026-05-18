<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Analitica</p>
        <h1>Reportes globales</h1>
        <p>Monitorea recaudacion, ocupacion, actividad de usuarios y alertas operativas.</p>
      </div>
      <div class="heading-actions">
        <q-btn outline color="primary" icon="date_range" label="Mayo 2026" no-caps />
        <q-btn color="primary" icon="download" label="Exportar reporte" no-caps />
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
      <div class="panel">
        <div class="panel-header"><div><h2>Rendimiento por condominio</h2><p>Indicadores principales del periodo.</p></div></div>
        <q-list separator class="clean-list">
          <q-item v-for="row in reportRows" :key="row.name" class="activity-row">
            <q-item-section avatar><q-avatar color="primary" text-color="white" icon="apartment" /></q-item-section>
            <q-item-section><q-item-label>{{ row.name }}</q-item-label><q-item-label caption>{{ row.detail }}</q-item-label></q-item-section>
            <q-item-section side><q-badge outline :color="row.color" :label="row.status" /></q-item-section>
          </q-item>
        </q-list>
      </div>

      <aside class="panel">
        <div class="panel-header"><div><h2>Reportes rapidos</h2><p>Descargas frecuentes.</p></div></div>
        <div class="quick-actions">
          <q-btn v-for="action in actions" :key="action.label" unelevated align="left" :icon="action.icon" :label="action.label" no-caps class="quick-action" />
        </div>
      </aside>
    </section>
  </q-page>
</template>

<script setup lang="ts">
const metrics = [
  { label: 'Recaudacion', value: '$48.760', detail: '92% del periodo', icon: 'payments', tone: 'positive' },
  { label: 'Ocupacion', value: '91%', detail: '+2.1% mensual', icon: 'home_work', tone: 'positive' },
  { label: 'Usuarios activos', value: '1.102', detail: '86% del total', icon: 'groups', tone: 'neutral' },
  { label: 'Alertas', value: '12', detail: '4 criticas', icon: 'flag', tone: 'warning' },
];

const reportRows = [
  { name: 'Mirador Norte', detail: '$8.420 recaudados - 94% ocupacion', status: 'Saludable', color: 'positive' },
  { name: 'Altos del Valle', detail: '$5.180 recaudados - administrador pendiente', status: 'Revision', color: 'warning' },
  { name: 'Sol del Caribe', detail: '$11.340 recaudados - 97% ocupacion', status: 'Saludable', color: 'positive' },
];

const actions = [
  { label: 'Recaudacion mensual', icon: 'payments' },
  { label: 'Usuarios por condominio', icon: 'groups' },
  { label: 'Alertas operativas', icon: 'flag' },
];
</script>

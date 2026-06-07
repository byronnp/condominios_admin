<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Historial de casa</p>
        <h1>{{ houseLabel }}</h1>
        <p>Mockup de movimientos, cambios de dueño, pagos y eventos de una vivienda.</p>
      </div>

      <div class="heading-actions">
        <q-btn outline color="primary" icon="arrow_back" label="Volver" to="/admin/casas" no-caps />
        <q-btn color="primary" icon="history" label="Agregar evento" no-caps />
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
      <div class="panel panel--large">
        <div class="panel-header">
          <div>
            <h2>Linea de tiempo</h2>
            <p>Eventos cronologicos del mockup.</p>
          </div>
        </div>

        <q-timeline color="primary" layout="comfortable">
          <q-timeline-entry v-for="event in events" :key="event.title" :title="event.title" :subtitle="event.subtitle" :icon="event.icon" :color="event.color">
            <div class="text-body2 text-grey-8">
              {{ event.description }}
            </div>
          </q-timeline-entry>
        </q-timeline>
      </div>

      <aside class="panel">
        <div class="panel-header">
          <div>
            <h2>Resumen de vivienda</h2>
            <p>Contexto minimo del mockup.</p>
          </div>
        </div>

        <q-list separator class="clean-list">
          <q-item v-for="item in details" :key="item.label" class="summary-row">
            <q-item-section avatar>
              <q-avatar :icon="item.icon" color="primary" text-color="white" size="36px" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.label }}</q-item-label>
              <q-item-label caption>{{ item.value }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </aside>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const houseLabel = computed(() => `Casa ${String(route.params.id || 'B-14')}`);

const metrics = [
  { label: 'Eventos', value: '24', detail: 'Registrados', icon: 'history', tone: 'neutral' },
  { label: 'Pagos', value: '18', detail: 'Confirmados', icon: 'payments', tone: 'positive' },
  { label: 'Dueños', value: '3', detail: 'Cambios historicos', icon: 'person', tone: 'warning' },
  { label: 'Alertas', value: '2', detail: 'Pendientes', icon: 'warning', tone: 'warning' },
];

const events = [
  { title: 'Cambio de dueño', subtitle: '12 mayo 2026', description: 'Se asigno un nuevo propietario principal a la casa.', icon: 'person_add', color: 'primary' },
  { title: 'Pago confirmado', subtitle: '08 mayo 2026', description: 'Se registro un pago manual y quedo en conciliacion.', icon: 'payments', color: 'positive' },
  { title: 'Mantenimiento menor', subtitle: '02 mayo 2026', description: 'Se atendio una solicitud de revisión de luminarias.', icon: 'build', color: 'warning' },
  { title: 'Invitacion temporal', subtitle: '30 abril 2026', description: 'Se emitio un pase de acceso para un invitado recurrente.', icon: 'badge', color: 'secondary' },
];

const details = [
  { icon: 'apartment', label: 'Condominio', value: 'Mirador Norte' },
  { icon: 'home', label: 'Codigo', value: '3-01-B2' },
  { icon: 'person', label: 'Actual dueño', value: 'Daniel Perez' },
  { icon: 'schedule', label: 'Ultima actividad', value: 'Hoy 08:42' },
];
</script>

<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Historial de residente</p>
        <h1>{{ residentLabel }}</h1>
        <p>Mockup para eventos del residente, accesos y cambios relevantes.</p>
      </div>

      <div class="heading-actions">
        <q-btn outline color="primary" icon="arrow_back" label="Volver" to="/residentes" no-caps />
        <q-btn color="primary" icon="history" label="Agregar nota" no-caps />
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
            <h2>Actividad del residente</h2>
            <p>Linea de tiempo con eventos del mockup.</p>
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
            <h2>Datos basicos</h2>
            <p>Referencia rapida del residente.</p>
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
const residentLabel = computed(() => String(route.params.id || 'Residente'));

const metrics = [
  { label: 'Movimientos', value: '29', detail: 'Historial total', icon: 'history', tone: 'neutral' },
  { label: 'Pagos', value: '14', detail: 'Registrados', icon: 'payments', tone: 'positive' },
  { label: 'Invitaciones', value: '8', detail: 'Emitidas', icon: 'badge', tone: 'warning' },
  { label: 'Solicitudes', value: '2', detail: 'Abiertas', icon: 'support_agent', tone: 'warning' },
];

const events = [
  { title: 'Alta de residente', subtitle: '15 mayo 2026', description: 'Se dio de alta y quedo vinculado a la casa asignada.', icon: 'person_add', color: 'primary' },
  { title: 'Pago confirmado', subtitle: '10 mayo 2026', description: 'Se registro el ultimo pago con comprobante pendiente de conciliacion.', icon: 'payments', color: 'positive' },
  { title: 'Invitacion recurrente', subtitle: '05 mayo 2026', description: 'Se autorizo un invitado recurrente para ingreso temporal.', icon: 'badge', color: 'secondary' },
  { title: 'Cambio de contacto', subtitle: '28 abril 2026', description: 'Se actualizo el telefono y correo de contacto principal.', icon: 'contact_phone', color: 'warning' },
];

const details = [
  { icon: 'home', label: 'Casa', value: 'Casa B-14' },
  { icon: 'apartment', label: 'Condominio', value: 'Mirador Norte' },
  { icon: 'email', label: 'Correo', value: 'daniel@email.com' },
  { icon: 'phone', label: 'Telefono', value: '099 420 1180' },
];
</script>

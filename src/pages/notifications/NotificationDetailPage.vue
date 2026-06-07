<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Detalle de notificacion</p>
        <h1>{{ notification.title }}</h1>
        <p>Mockup del detalle individual con acciones de lectura y archivo.</p>
      </div>

      <div class="heading-actions">
        <q-btn outline color="primary" icon="arrow_back" label="Volver" to="/notificaciones" no-caps />
        <q-btn color="primary" icon="done_all" label="Marcar leida" no-caps />
      </div>
    </section>

    <section class="create-layout">
      <div class="panel form-panel">
        <div class="panel-header">
          <div>
            <h2>Contenido</h2>
            <p>Vista de referencia para una notificacion individual.</p>
          </div>
        </div>

        <div class="form-grid">
          <q-input v-model="notification.title" outlined dense label="Titulo" class="soft-input" readonly />
          <q-input v-model="notification.type" outlined dense label="Tipo" class="soft-input" readonly />
          <q-input v-model="notification.source" outlined dense label="Origen" class="soft-input" readonly />
          <q-input v-model="notification.date" outlined dense label="Fecha" class="soft-input" readonly />
          <q-input v-model="notification.message" outlined dense type="textarea" autogrow label="Mensaje" class="soft-input form-grid__full" readonly />
        </div>
      </div>

      <aside class="panel summary-panel">
        <div class="panel-header">
          <div>
            <h2>Estados</h2>
            <p>Acciones y contexto del aviso.</p>
          </div>
        </div>

        <q-banner rounded class="bg-blue-1 text-primary q-mb-md">
          El detalle puede conectarse luego a un centro de notificaciones en tiempo real.
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

const notification = reactive({
  title: 'Pago registrado en B-14',
  type: 'Pago',
  source: 'Sistema de pagos',
  date: 'Hoy 08:42',
  message: 'La casa B-14 reporto un nuevo pago y espera confirmacion para conciliacion final.',
});

const timeline = [
  { icon: 'notifications', label: 'Creada', caption: 'Hoy 08:40' },
  { icon: 'mark_email_read', label: 'Leida', caption: 'No aun' },
  { icon: 'archive', label: 'Archivada', caption: 'Pendiente' },
];
</script>

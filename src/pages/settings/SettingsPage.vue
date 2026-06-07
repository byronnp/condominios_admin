<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Configuracion</p>
        <h1>Ajustes de plataforma</h1>
        <p>Define parametros generales, seguridad y preferencias operativas del sistema.</p>
      </div>
      <div class="heading-actions">
        <q-btn color="primary" icon="save" label="Guardar ajustes" no-caps />
      </div>
    </section>

    <section class="create-layout">
      <div class="panel form-panel">
        <div class="panel-header"><div><h2>Preferencias generales</h2><p>Valores base para la operacion global.</p></div></div>
        <div class="form-grid">
          <q-input v-model="settings.platformName" outlined dense hide-bottom-space label="Nombre de plataforma" class="soft-input" />
          <q-select v-model="settings.timezone" outlined dense hide-bottom-space :options="timezoneOptions" label="Zona horaria" class="soft-input" />
          <q-select v-model="settings.currency" outlined dense hide-bottom-space :options="currencyOptions" label="Moneda" class="soft-input" />
          <q-select v-model="settings.language" outlined dense hide-bottom-space :options="languageOptions" label="Idioma" class="soft-input" />
        </div>
      </div>

      <aside class="panel summary-panel">
        <div class="panel-header"><div><h2>Seguridad</h2><p>Controles recomendados.</p></div></div>
        <q-list separator class="clean-list">
          <q-item v-for="item in securityItems" :key="item.label" class="summary-row">
            <q-item-section avatar><q-icon :name="item.icon" color="primary" /></q-item-section>
            <q-item-section><q-item-label>{{ item.label }}</q-item-label><q-item-label caption>{{ item.caption }}</q-item-label></q-item-section>
            <q-item-section side><q-toggle v-model="item.enabled" color="primary" /></q-item-section>
          </q-item>
        </q-list>
      </aside>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const timezoneOptions = ['America/Guayaquil', 'America/Bogota', 'America/Lima'];
const currencyOptions = ['USD', 'COP', 'PEN'];
const languageOptions = ['Espanol', 'Ingles'];

const settings = reactive({
  platformName: 'Condominios Admin',
  timezone: 'America/Guayaquil',
  currency: 'USD',
  language: 'Espanol',
});

const securityItems = reactive([
  { icon: 'lock', label: 'Sesion segura', caption: 'Cerrar sesiones inactivas automaticamente', enabled: true },
  { icon: 'verified_user', label: 'Validacion de administradores', caption: 'Revisar nuevos responsables antes de activar', enabled: true },
  { icon: 'notifications', label: 'Alertas criticas', caption: 'Notificar eventos operativos importantes', enabled: true },
]);
</script>

<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Perfil</p>
        <h1>Mi cuenta</h1>
        <p>Mockup del perfil de usuario con datos, acceso reciente y preferencias.</p>
      </div>

      <div class="heading-actions">
        <q-btn outline color="primary" icon="edit" label="Editar perfil" no-caps />
        <q-btn color="primary" icon="security" label="Seguridad" no-caps />
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
            <h2>Datos de perfil</h2>
            <p>Vista de referencia para editar informacion personal.</p>
          </div>
        </div>

        <div class="form-grid">
          <q-input v-model="form.name" outlined dense hide-bottom-space label="Nombre" class="soft-input" />
          <q-input v-model="form.email" outlined dense hide-bottom-space label="Correo" class="soft-input" />
          <q-input v-model="form.phone" outlined dense hide-bottom-space label="Telefono" class="soft-input" />
          <q-input v-model="form.role" outlined dense hide-bottom-space label="Rol" class="soft-input" readonly />
          <q-input v-model="form.condominium" outlined dense hide-bottom-space label="Condominio" class="soft-input" readonly />
          <q-input v-model="form.house" outlined dense hide-bottom-space label="Casa" class="soft-input" readonly />
        </div>
      </div>

      <aside class="panel summary-panel">
        <div class="panel-header">
          <div>
            <h2>Actividad y preferencias</h2>
            <p>Resumen para completar el mockup de perfil.</p>
          </div>
        </div>

        <q-banner rounded class="bg-blue-1 text-primary q-mb-md">
          El perfil todavia no esta conectado al backend. Esta vista solo define la interfaz.
        </q-banner>

        <q-list separator class="clean-list">
          <q-item v-for="item in items" :key="item.label" class="summary-row">
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
  { label: 'Sesion', value: 'Activa', detail: 'Ultimo ingreso hoy', icon: 'verified_user', tone: 'positive' },
  { label: 'Mensajes', value: '3', detail: 'Pendientes de revisar', icon: 'notifications', tone: 'warning' },
  { label: 'Tareas', value: '5', detail: 'Sin completar', icon: 'task_alt', tone: 'neutral' },
  { label: 'Dispositivos', value: '2', detail: 'Con acceso reciente', icon: 'devices', tone: 'positive' },
];

const form = reactive({
  name: 'Andrea Molina',
  email: 'andrea@condominios.com',
  phone: '099 220 4570',
  role: 'Super administrador',
  condominium: 'Mirador Norte',
  house: 'Casa B-14',
});

const items = [
  { icon: 'history', label: 'Ultima actividad', caption: 'Ingreso desde navegador hoy 08:42' },
  { icon: 'lock', label: 'Seguridad', caption: 'Cambio de clave pendiente en siguiente iteracion' },
  { icon: 'palette', label: 'Preferencias', caption: 'Tema, notificaciones y lenguaje' },
];
</script>

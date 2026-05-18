<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Nuevo usuario</p>
        <h1>Crear usuario</h1>
        <p>Registra un usuario y vincula su acceso a un condominio y propiedad.</p>
      </div>
      <div class="heading-actions">
        <q-btn outline color="primary" icon="arrow_back" label="Volver" to="/usuarios" no-caps />
        <q-btn color="primary" icon="save" label="Guardar usuario" no-caps @click="submitForm" />
      </div>
    </section>

    <q-form class="create-layout" @submit.prevent="submitForm">
      <section class="panel form-panel">
        <div class="panel-header"><div><h2>Datos del usuario</h2><p>Informacion de identidad y acceso.</p></div></div>
        <div class="form-grid">
          <q-input v-model="form.name" outlined dense label="Nombre completo" class="soft-input" />
          <q-input v-model="form.email" outlined dense type="email" label="Correo" class="soft-input" />
          <q-select v-model="form.condominium" outlined dense :options="condominiumOptions" label="Condominio" class="soft-input" />
          <q-input v-model="form.property" outlined dense label="Propiedad" class="soft-input" />
          <q-select v-model="form.role" outlined dense :options="roleOptions" label="Rol" class="soft-input" />
          <q-select v-model="form.status" outlined dense :options="statusOptions" label="Estado" class="soft-input" />
        </div>
      </section>

      <aside class="panel summary-panel">
        <div class="panel-header"><div><h2>Resumen</h2><p>Vinculacion inicial del usuario.</p></div></div>
        <q-list separator class="clean-list">
          <q-item v-for="item in summaryItems" :key="item.label" class="summary-row">
            <q-item-section avatar><q-avatar :icon="item.icon" color="primary" text-color="white" size="36px" /></q-item-section>
            <q-item-section><q-item-label>{{ item.label }}</q-item-label><q-item-label caption>{{ item.value }}</q-item-label></q-item-section>
          </q-item>
        </q-list>
      </aside>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import type { UserForm } from '../interfaces/users/user-form.interface';

const condominiumOptions = ['Mirador Norte', 'Portal del Bosque', 'Riberas del Austro', 'Las Cumbres'];
const roleOptions = ['Residente', 'Propietario', 'Invitado recurrente'];
const statusOptions = ['Activo', 'Pendiente', 'Inactivo'];

const form = reactive<UserForm>({
  name: 'Carla Ruiz',
  email: 'carla@email.com',
  condominium: 'Mirador Norte',
  property: 'Casa B-18',
  role: 'Residente',
  status: 'Activo',
});

const summaryItems = computed(() => [
  { icon: 'person', label: 'Usuario', value: form.name || 'Sin nombre' },
  { icon: 'apartment', label: 'Condominio', value: form.condominium || 'Pendiente' },
  { icon: 'home', label: 'Propiedad', value: form.property || 'Pendiente' },
]);

function submitForm() {
  console.info('Usuario listo para guardar', { ...form });
}
</script>

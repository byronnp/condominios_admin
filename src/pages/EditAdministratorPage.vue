<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Editar administrador</p>
        <h1>{{ form.name }}</h1>
        <p>Actualiza datos de contacto, permisos y estado operativo.</p>
      </div>
      <div class="heading-actions">
        <q-btn outline color="primary" icon="arrow_back" label="Volver" to="/administradores" no-caps />
        <q-btn color="primary" icon="save" label="Guardar cambios" no-caps @click="submitForm" />
      </div>
    </section>

    <q-form class="create-layout" @submit.prevent="submitForm">
      <section class="panel form-panel">
        <div class="panel-header"><div><h2>Datos del administrador</h2><p>Informacion visible para el equipo central.</p></div></div>
        <div class="form-grid">
          <q-input v-model="form.name" outlined dense label="Nombre completo" class="soft-input" />
          <q-input v-model="form.email" outlined dense type="email" label="Correo" class="soft-input" />
          <q-input v-model="form.phone" outlined dense label="Telefono" class="soft-input" />
          <q-input v-model="form.city" outlined dense label="Ciudad" class="soft-input" />
          <q-select v-model="form.condominium" outlined dense :options="condominiumOptions" label="Condominio asignado" class="soft-input" />
          <q-select v-model="form.status" outlined dense :options="statusOptions" label="Estado" class="soft-input" />
          <q-select v-model="form.permissions" outlined dense :options="permissionOptions" label="Permisos" class="soft-input form-grid__full" />
        </div>
      </section>

      <aside class="panel summary-panel">
        <div class="panel-header"><div><h2>Resumen</h2><p>Datos que se actualizaran.</p></div></div>
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
import { useRoute } from 'vue-router';
import type { AdministratorForm } from '../interfaces/administrators/administrator-form.interface';

const route = useRoute();
const condominiumOptions = ['Mirador Norte', 'Portal del Bosque', 'Riberas del Austro', 'Las Cumbres'];
const statusOptions = ['Activo', 'Pendiente', 'Inactivo'];
const permissionOptions = ['Administrador completo', 'Solo lectura', 'Operativo'];

const records: Record<string, AdministratorForm> = {
  '1': { name: 'Maria Beltran', email: 'maria@miradornorte.com', phone: '098 420 1180', condominium: 'Mirador Norte', city: 'Quito', status: 'Activo', permissions: 'Administrador completo' },
  '2': { name: 'Jorge Andrade', email: 'jorge@portaldelbosque.com', phone: '098 610 3470', condominium: 'Portal del Bosque', city: 'Cuenca', status: 'Activo', permissions: 'Operativo' },
  '3': { name: 'Sofia Cardenas', email: 'sofia@riberasdelaustro.com', phone: '098 770 4512', condominium: 'Riberas del Austro', city: 'Cuenca', status: 'Pendiente', permissions: 'Solo lectura' },
};

const selected: AdministratorForm = records[String(route.params.id || '1')] ?? {
  name: 'Administrador no encontrado',
  email: '',
  phone: '',
  condominium: 'Mirador Norte',
  city: 'Quito',
  status: 'Pendiente',
  permissions: 'Solo lectura',
};
const form = reactive<AdministratorForm>({ ...selected });

const summaryItems = computed(() => [
  { icon: 'person', label: 'Administrador', value: form.name || 'Sin nombre' },
  { icon: 'apartment', label: 'Condominio', value: form.condominium || 'Pendiente' },
  { icon: 'verified', label: 'Estado', value: form.status || 'Pendiente' },
]);

function submitForm() {
  console.info('Cambios de administrador listos para guardar', { id: route.params.id, ...form });
}
</script>

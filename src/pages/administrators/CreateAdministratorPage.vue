<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Nuevo administrador</p>
        <h1>Crear administrador</h1>
        <p>Registra el responsable operativo y su condominio asignado.</p>
      </div>
      <div class="heading-actions">
        <q-btn outline color="primary" icon="arrow_back" label="Volver" to="/administradores" no-caps />
        <q-btn color="primary" icon="save" label="Guardar administrador" no-caps @click="submitForm" />
      </div>
    </section>

    <q-form ref="formRef" class="create-layout" @submit.prevent="submitForm">
      <section class="panel form-panel">
        <div class="panel-header"><div><h2>Datos del administrador</h2><p>Informacion de contacto y acceso.</p></div></div>
        <div class="form-grid">
          <q-input
            v-model="form.name"
            outlined
            dense
            hide-bottom-space
            label="Nombre completo"
            class="soft-input"
            :rules="[requiredRule('El nombre completo')]"
          />
          <q-input
            v-model="form.email"
            outlined
            dense
            type="email"
            label="Correo"
            class="soft-input"
            hide-bottom-space
            :rules="[requiredRule('El correo')]"
          />
          <q-input
            v-model="form.phone"
            outlined
            dense
            hide-bottom-space
            label="Telefono"
            class="soft-input"
            :rules="[requiredRule('El telefono')]"
          />
          <q-input
            v-model="form.city"
            outlined
            dense
            hide-bottom-space
            label="Ciudad"
            class="soft-input"
            :rules="[requiredRule('La ciudad')]"
          />
          <q-select
            v-model="form.condominium"
            outlined
            dense
            hide-bottom-space
            :options="condominiumOptions"
            label="Condominio asignado"
            class="soft-input"
            :rules="[requiredRule('El condominio asignado')]"
          />
          <q-select
            v-model="form.permissions"
            outlined
            dense
            hide-bottom-space
            :options="permissionOptions"
            label="Permisos"
            class="soft-input"
            :rules="[requiredRule('Los permisos')]"
          />
        </div>
      </section>

      <aside class="panel summary-panel">
        <div class="panel-header"><div><h2>Resumen</h2><p>Configuracion inicial del administrador.</p></div></div>
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
import { computed, reactive, ref } from 'vue';
import { requiredRule } from '../../composables/shared/form-rules';
import type { AdministratorForm } from '../../interfaces/administrators/administrator-form.interface';

const condominiumOptions = ['Mirador Norte', 'Portal del Bosque', 'Riberas del Austro', 'Las Cumbres'];
const permissionOptions = ['Administrador completo', 'Solo lectura', 'Operativo'];
const formRef = ref<{ validate: () => Promise<boolean> | boolean } | null>(null);

const form = reactive<AdministratorForm>({
  name: 'Andrea Molina',
  email: 'andrea@condominios.com',
  phone: '099 220 4570',
  condominium: 'Mirador Norte',
  city: 'Quito',
  status: 'Activo',
  permissions: 'Administrador completo',
});

const summaryItems = computed(() => [
  { icon: 'person', label: 'Administrador', value: form.name || 'Sin nombre' },
  { icon: 'apartment', label: 'Condominio', value: form.condominium || 'Pendiente' },
  { icon: 'admin_panel_settings', label: 'Permisos', value: form.permissions || 'Pendiente' },
]);

async function submitForm() {
  const isValid = await formRef.value?.validate();

  if (isValid === false) {
    return;
  }

  console.info('Administrador listo para guardar', { ...form });
}
</script>

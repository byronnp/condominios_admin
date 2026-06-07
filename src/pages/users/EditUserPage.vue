<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Editar usuario</p>
        <h1>{{ form.name }}</h1>
        <p>Actualiza vinculacion, rol y estado de acceso del usuario.</p>
      </div>
      <div class="heading-actions">
        <q-btn outline color="primary" icon="arrow_back" label="Volver4" to="/usuarios" no-caps />
        <q-btn color="primary" icon="save" label="Guardar cambios" no-caps @click="submitForm" />
      </div>
    </section>

    <q-form ref="formRef" class="create-layout" @submit.prevent="submitForm">
      <section class="panel form-panel">
        <div class="panel-header">
          <div>
            <h2>Datos del usuario</h2>
            <p>Informacion visible para administradores.</p>
          </div>
        </div>
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
          <q-select
            v-model="form.condominium"
            outlined
            dense
            :options="condominiumOptions"
            label="Condominio"
            class="soft-input"
            hide-bottom-space
            :rules="[requiredRule('El condominio')]"
          />
          <q-input
            v-model="form.property"
            outlined
            dense
            hide-bottom-space
            label="Propiedad"
            class="soft-input"
            :rules="[requiredRule('La propiedad')]"
          />
          <q-select
            v-model="form.role"
            outlined
            dense
            :options="roleOptions"
            label="Rol"
            class="soft-input"
            hide-bottom-space
            :rules="[requiredRule('El rol')]"
          />
          <q-select
            v-model="form.status"
            outlined
            dense
            :options="statusOptions"
            label="Estado"
            class="soft-input"
            hide-bottom-space
            :rules="[requiredRule('El estado')]"
          />
        </div>
      </section>

      <aside class="panel summary-panel">
        <div class="panel-header">
          <div>
            <h2>Resumen</h2>
            <p>Datos que se actualizaran.</p>
          </div>
        </div>
        <q-list separator class="clean-list">
          <q-item v-for="item in summaryItems" :key="item.label" class="summary-row">
            <q-item-section avatar
              ><q-avatar :icon="item.icon" color="primary" text-color="white" size="36px"
            /></q-item-section>
            <q-item-section
              ><q-item-label>{{ item.label }}</q-item-label
              ><q-item-label caption>{{ item.value }}</q-item-label></q-item-section
            >
          </q-item>
        </q-list>
      </aside>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { requiredRule } from '../../composables/shared/form-rules';
import type { UserForm } from '../../interfaces/users/user-form.interface';

const route = useRoute();
const condominiumOptions = [
  'Mirador Norte',
  'Portal del Bosque',
  'Riberas del Austro',
  'Las Cumbres',
];
const roleOptions = ['Residente', 'Propietario', 'Invitado recurrente'];
const statusOptions = ['Activo', 'Pendiente', 'Inactivo'];
const formRef = ref<{ validate: () => Promise<boolean> | boolean } | null>(null);

const records: Record<string, UserForm> = {
  '1': {
    name: 'Daniel Perez',
    email: 'daniel@email.com',
    condominium: 'Mirador Norte',
    property: 'Casa B-14',
    role: 'Residente',
    status: 'Activo',
  },
  '2': {
    name: 'Lucia Castro',
    email: 'lucia@email.com',
    condominium: 'Portal del Bosque',
    property: 'Depto 302',
    role: 'Propietario',
    status: 'Activo',
  },
  '3': {
    name: 'Rafael Mora',
    email: 'rafael@email.com',
    condominium: 'Las Cumbres',
    property: 'Casa A-07',
    role: 'Residente',
    status: 'Pendiente',
  },
};

const selected: UserForm = records[String(route.params.id || '1')] ?? {
  name: 'Usuario no encontrado',
  email: '',
  condominium: 'Mirador Norte',
  property: '',
  role: 'Residente',
  status: 'Pendiente',
};
const form = reactive<UserForm>({ ...selected });

const summaryItems = computed(() => [
  { icon: 'person', label: 'Usuario', value: form.name || 'Sin nombre' },
  { icon: 'badge', label: 'Rol', value: form.role || 'Pendiente' },
  { icon: 'verified', label: 'Estado', value: form.status || 'Pendiente' },
]);

async function submitForm() {
  const isValid = await formRef.value?.validate();

  if (isValid === false) {
    return;
  }

  console.info('Cambios de usuario listos para guardar', { id: route.params.id, ...form });
}
</script>

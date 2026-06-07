<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Editar residente</p>
        <h1>{{ form.firstName }} {{ form.lastName }}</h1>
        <p>Actualiza la informacion principal y la asignacion a su vivienda.</p>
      </div>

      <div class="heading-actions">
        <q-btn outline color="primary" icon="arrow_back" label="Volver" to="/residentes" no-caps />
        <q-btn color="primary" icon="save" label="Guardar cambios" no-caps @click="submitForm" />
      </div>
    </section>

    <q-form ref="formRef" class="create-layout" @submit.prevent="submitForm">
      <section class="panel form-panel">
        <div class="panel-header">
          <div>
            <h2>Datos del residente</h2>
            <p>Refina los campos visibles del registro.</p>
          </div>
        </div>

        <div class="form-grid">
          <q-input v-model="form.firstName" outlined dense hide-bottom-space label="Nombre" class="soft-input" :rules="[requiredRule]" lazy-rules="ondemand" />
          <q-input v-model="form.lastName" outlined dense hide-bottom-space label="Apellido" class="soft-input" :rules="[requiredRule]" lazy-rules="ondemand" />
          <q-select v-model="form.identificationType" outlined dense hide-bottom-space :options="identificationTypeOptions" label="Tipo de identificacion" class="soft-input" :rules="[requiredRule]" lazy-rules="ondemand" />
          <q-input v-model="form.identificationNumber" outlined dense hide-bottom-space label="Numero de identificacion" class="soft-input" :rules="[requiredRule]" lazy-rules="ondemand" />
          <q-input v-model="form.email" outlined dense hide-bottom-space type="email" label="Correo" class="soft-input" :rules="[requiredRule, emailRule]" lazy-rules="ondemand" />
          <q-select v-model="form.house" outlined dense hide-bottom-space :options="houseOptions" label="Casa" class="soft-input" :rules="[requiredRule]" lazy-rules="ondemand" />
          <q-select v-model="form.relationship" outlined dense hide-bottom-space :options="relationshipOptions" label="Relacion" class="soft-input" :rules="[requiredRule]" lazy-rules="ondemand" />
          <q-select v-model="form.role" outlined dense hide-bottom-space :options="roleOptions" label="Rol" class="soft-input" :rules="[requiredRule]" lazy-rules="ondemand" />
          <q-input v-model="form.mobilePhone" outlined dense hide-bottom-space label="Telefono movil" class="soft-input" />
          <q-input v-model="form.landlinePhone" outlined dense hide-bottom-space label="Telefono fijo" class="soft-input" />
          <q-select v-model="form.status" outlined dense hide-bottom-space :options="statusOptions" label="Estado" class="soft-input" :rules="[requiredRule]" lazy-rules="ondemand" />
          <div class="form-grid__full row items-center q-gutter-md">
            <q-checkbox v-model="form.receiveNotifications" dense label="Puede recibir notificaciones" />
          </div>
        </div>
      </section>

      <aside class="panel summary-panel">
        <div class="panel-header">
          <div>
            <h2>Resumen</h2>
            <p>Replica lo que quedara visible para administracion.</p>
          </div>
        </div>

        <div class="owner-summary">
          <div class="owner-summary__hero">
            <q-avatar color="primary" text-color="white" size="52px">{{ summaryInitials }}</q-avatar>
            <div>
              <span>Residente</span>
              <strong>{{ summaryName }}</strong>
              <small>{{ form.email || 'Sin correo' }}</small>
            </div>
          </div>

          <div class="owner-summary__grid">
            <div><span>Casa</span><strong>{{ form.house || 'Pendiente' }}</strong></div>
            <div><span>Relacion</span><strong>{{ form.relationship || 'Pendiente' }}</strong></div>
            <div><span>Rol</span><strong>{{ form.role || 'Pendiente' }}</strong></div>
            <div><span>Estado</span><strong>{{ form.status || 'Pendiente' }}</strong></div>
          </div>
        </div>
      </aside>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { ResidentFormData } from '../../interfaces/residents/resident.interface';

const route = useRoute();
const formRef = ref<{ validate: () => Promise<boolean> | boolean } | null>(null);

const identificationTypeOptions = ['Cedula', 'Pasaporte', 'RUC'];
const houseOptions = ['Casa B-14', 'Depto 302', 'Casa A-07', 'Casa C-11'];
const relationshipOptions = ['Propietario', 'Conyuge', 'Familiar', 'Arrendatario', 'Representante'];
const roleOptions = ['Residente', 'Propietario', 'Invitado'];
const statusOptions = ['Activo', 'Pendiente', 'Inactivo'];

const records: Record<string, ResidentFormData> = {
  '1': {
    firstName: 'Daniel',
    lastName: 'Perez',
    identificationType: 'Cedula',
    identificationNumber: '0901234567',
    email: 'daniel@email.com',
    mobilePhone: '0991234567',
    landlinePhone: '',
    condominium: 'Mirador Norte',
    house: 'Casa B-14',
    relationship: 'Propietario',
    role: 'Residente',
    status: 'Activo',
    receiveNotifications: true,
  },
  '2': {
    firstName: 'Lucia',
    lastName: 'Castro',
    identificationType: 'Pasaporte',
    identificationNumber: 'P-889233',
    email: 'lucia@email.com',
    mobilePhone: '0987771122',
    landlinePhone: '',
    condominium: 'Portal del Bosque',
    house: 'Depto 302',
    relationship: 'Conyuge',
    role: 'Propietario',
    status: 'Activo',
    receiveNotifications: true,
  },
};

const form = reactive<ResidentFormData>(
  records[String(route.params.id || '1')] ?? {
    firstName: 'Residente',
    lastName: 'No encontrado',
    identificationType: 'Cedula',
    identificationNumber: '',
    email: '',
    mobilePhone: '',
    landlinePhone: '',
    condominium: 'Mirador Norte',
    house: '',
    relationship: 'Propietario',
    role: 'Residente',
    status: 'Pendiente',
    receiveNotifications: false,
  },
);

const summaryName = computed(() => [form.firstName, form.lastName].filter(Boolean).join(' ') || 'Sin nombre');
const summaryInitials = computed(() => summaryName.value.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'RE');

function requiredRule(value: unknown) {
  return value === null || value === undefined || value === '' ? 'Este campo es obligatorio' : true;
}

function emailRule(value: string) {
  if (!value.trim()) {
    return 'Ingresa un correo';
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? true : 'Ingresa un correo valido';
}

async function submitForm() {
  const valid = await formRef.value?.validate();
  if (!valid) {
    return;
  }

  console.info('Residente listo para actualizar', { id: route.params.id, ...form });
}
</script>

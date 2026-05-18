<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Nuevo condominio</p>
        <h1>Crear condominio</h1>
        <p>
          Registra la informacion base del conjunto, sus responsables y los parametros operativos
          iniciales.
        </p>
      </div>

      <div class="heading-actions">
        <q-btn outline color="primary" icon="arrow_back" label="Volver" to="/condominios" no-caps />
        <q-btn color="primary" icon="save" label="Guardar condominio" no-caps @click="submitForm" />
      </div>
    </section>

    <q-form class="create-layout" @submit.prevent="submitForm">
      <section class="panel form-panel">
        <div class="panel-header">
          <div>
            <h2>Informacion general</h2>
            <p>Datos visibles para administradores y reportes globales.</p>
          </div>
        </div>

        <div class="form-grid">
          <q-input v-model="form.name" outlined dense label="Nombre del condominio" class="soft-input" />
          <q-input v-model="form.ruc" outlined dense label="RUC o identificacion" class="soft-input" />
          <q-input v-model="form.city" outlined dense label="Ciudad" class="soft-input" />
          <q-input v-model="form.sector" outlined dense label="Sector" class="soft-input" />
          <q-input v-model="form.address" outlined dense label="Direccion completa" class="soft-input form-grid__full" />
          <q-input
            v-model.number="form.units"
            outlined
            dense
            type="number"
            label="Numero de unidades"
            class="soft-input"
          />
        </div>
      </section>

      <section class="panel form-panel">
        <div class="panel-header">
          <div>
            <h2>Responsables</h2>
            <p>Contacto administrativo y datos para comunicacion operativa.</p>
          </div>
        </div>

        <div class="form-grid">
          <q-input v-model="form.adminName" outlined dense label="Administrador principal" class="soft-input" />
          <q-input v-model="form.adminEmail" outlined dense type="email" label="Correo del administrador" class="soft-input" />
          <q-input v-model="form.adminPhone" outlined dense label="Telefono" class="soft-input" />
          <q-select
            v-model="form.plan"
            outlined
            dense
            :options="planOptions"
            label="Plan contratado"
            class="soft-input"
          />
        </div>
      </section>

      <aside class="panel summary-panel">
        <div class="panel-header">
          <div>
            <h2>Resumen inicial</h2>
            <p>Configuracion que se activara al guardar.</p>
          </div>
        </div>

        <q-list separator class="clean-list">
          <q-item v-for="item in summaryItems" :key="item.label" class="summary-row">
            <q-item-section avatar>
              <q-avatar :icon="item.icon" color="primary" text-color="white" size="36px" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.label }}</q-item-label>
              <q-item-label caption>{{ item.value }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <div class="quick-actions summary-actions">
          <q-btn type="submit" color="primary" icon="save" label="Guardar condominio" no-caps />
          <q-btn outline color="primary" icon="visibility" label="Vista previa" no-caps />
        </div>
      </aside>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import type { CreateCondominiumForm } from '../interfaces/create-condominium/condominium-form.interface';

const planOptions = ['Estandar', 'Profesional', 'Corporativo'];

const form = reactive<CreateCondominiumForm>({
  name: 'Torre Jardin',
  ruc: '1792845639001',
  city: 'Quito',
  sector: 'Cumbaya',
  address: 'Av. Interoceanica y Calle de los Cipreses',
  units: 72,
  adminName: 'Carolina Viteri',
  adminEmail: 'carolina@torrejardin.com',
  adminPhone: '099 842 1170',
  plan: 'Profesional',
});

const summaryItems = computed(() => [
  { icon: 'apartment', label: 'Condominio', value: form.name || 'Sin nombre' },
  { icon: 'home_work', label: 'Unidades registradas', value: `${form.units || 0} unidades` },
  { icon: 'manage_accounts', label: 'Responsable', value: form.adminName || 'Pendiente' },
  { icon: 'tune', label: 'Parametros', value: 'Se configuraran despues de crear el condominio' },
]);

function submitForm() {
  console.info('Condominio listo para guardar', { ...form });
}
</script>

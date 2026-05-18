<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Editar condominio</p>
        <h1>{{ form.name }}</h1>
        <p>
          Actualiza la informacion principal del condominio, su responsable administrativo y el estado
          operativo visible en la plataforma.
        </p>
      </div>

      <div class="heading-actions">
        <q-btn outline color="primary" icon="arrow_back" label="Volver" to="/condominios" no-caps />
        <q-btn color="primary" icon="save" label="Guardar cambios" no-caps @click="submitForm" />
      </div>
    </section>

    <q-form class="create-layout" @submit.prevent="submitForm">
      <section class="panel form-panel">
        <div class="panel-header">
          <div>
            <h2>Informacion general</h2>
            <p>Datos base del conjunto y ubicacion.</p>
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
          <q-select
            v-model="form.status"
            outlined
            dense
            :options="statusOptions"
            label="Estado operativo"
            class="soft-input"
          />
        </div>
      </section>

      <section class="panel form-panel">
        <div class="panel-header">
          <div>
            <h2>Responsables</h2>
            <p>Datos del administrador y plan activo.</p>
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
            <h2>Resumen de cambios</h2>
            <p>Informacion que se guardara para este condominio.</p>
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
          <q-btn type="submit" color="primary" icon="save" label="Guardar cambios" no-caps />
          <q-btn outline color="primary" icon="history" label="Ver historial" no-caps />
        </div>
      </aside>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import type { EditCondominiumForm } from '../interfaces/edit-condominium/condominium-form.interface';

const route = useRoute();
const planOptions = ['Estandar', 'Profesional', 'Corporativo'];
const statusOptions = ['Activo', 'En revision', 'Pendiente', 'Inactivo'];

const condominiums: Record<string, EditCondominiumForm> = {
  '1': {
    name: 'Mirador Norte',
    ruc: '1790012845001',
    city: 'Quito',
    sector: 'Granados',
    address: 'Av. de los Granados N42-18',
    units: 84,
    status: 'Activo',
    adminName: 'Maria Beltran',
    adminEmail: 'maria@miradornorte.com',
    adminPhone: '098 420 1180',
    plan: 'Profesional',
  },
  '2': {
    name: 'Altos del Valle',
    ruc: '1790084512001',
    city: 'Quito',
    sector: 'Intervalles',
    address: 'Via Intervalles km 7',
    units: 126,
    status: 'En revision',
    adminName: 'Pendiente',
    adminEmail: 'admin@altosdelvalle.com',
    adminPhone: '099 210 8842',
    plan: 'Corporativo',
  },
  '3': {
    name: 'Portal del Bosque',
    ruc: '0190428011001',
    city: 'Cuenca',
    sector: 'El Bosque',
    address: 'Calle Cedros y Arrayanes',
    units: 64,
    status: 'Activo',
    adminName: 'Jorge Andrade',
    adminEmail: 'jorge@portaldelbosque.com',
    adminPhone: '098 610 3470',
    plan: 'Estandar',
  },
  '4': {
    name: 'Sol del Caribe',
    ruc: '0992841123001',
    city: 'Guayaquil',
    sector: 'Malecon',
    address: 'Malecon 2000, bloque C',
    units: 142,
    status: 'Activo',
    adminName: 'Paula Mendez',
    adminEmail: 'paula@soldelcaribe.com',
    adminPhone: '099 540 2901',
    plan: 'Corporativo',
  },
  '5': {
    name: 'Riberas del Austro',
    ruc: '0198203417001',
    city: 'Cuenca',
    sector: 'Yanuncay',
    address: 'Av. Loja y Primero de Mayo',
    units: 58,
    status: 'Pendiente',
    adminName: 'Sofia Cardenas',
    adminEmail: 'sofia@riberasdelaustro.com',
    adminPhone: '098 770 4512',
    plan: 'Estandar',
  },
  '6': {
    name: 'Las Cumbres',
    ruc: '1794528109001',
    city: 'Quito',
    sector: 'Ruta Viva',
    address: 'Ruta Viva km 11',
    units: 96,
    status: 'Activo',
    adminName: 'Diego Torres',
    adminEmail: 'diego@lascumbres.com',
    adminPhone: '099 138 7604',
    plan: 'Profesional',
  },
};

const selectedId = String(route.params.id || '1');
const selectedCondominium: EditCondominiumForm = condominiums[selectedId] ?? {
  name: 'Condominio no encontrado',
  ruc: '',
  city: '',
  sector: '',
  address: '',
  units: 0,
  status: 'Pendiente',
  adminName: 'Pendiente',
  adminEmail: '',
  adminPhone: '',
  plan: 'Estandar',
};

const form = reactive<EditCondominiumForm>({ ...selectedCondominium });

const summaryItems = computed(() => [
  { icon: 'apartment', label: 'Condominio', value: form.name || 'Sin nombre' },
  { icon: 'location_on', label: 'Ubicacion', value: `${form.city || 'Sin ciudad'} - ${form.sector || 'Sin sector'}` },
  { icon: 'home_work', label: 'Unidades', value: `${form.units || 0} unidades` },
  { icon: 'verified', label: 'Estado', value: form.status || 'Pendiente' },
  { icon: 'manage_accounts', label: 'Responsable', value: form.adminName || 'Pendiente' },
]);

function submitForm() {
  console.info('Cambios de condominio listos para guardar', { id: selectedId, ...form });
}
</script>

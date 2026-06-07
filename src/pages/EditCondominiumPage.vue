<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Editar condominio</p>
        <h1>{{ form.name }}</h1>
        <p>
          Actualiza la informacion principal del condominio, su responsable administrativo y el
          estado operativo visible en la plataforma.
        </p>
      </div>

      <div class="heading-actions">
        <q-btn
          outline
          color="primary"
          icon="arrow_back"
          label="Volver"
          to="/admin/condominios"
          no-caps
        />
        <q-btn
          color="primary"
          icon="save"
          label="Guardar cambios"
          no-caps
          :loading="saving"
          :disable="!canSubmit"
          @click="submitForm"
        />
      </div>
    </section>

    <q-banner v-if="error" rounded class="bg-red-1 text-negative q-mb-md">
      {{ error }}
      <template #action>
        <q-btn flat color="negative" label="Reintentar" no-caps @click="loadPageData" />
      </template>
    </q-banner>

    <q-form class="create-layout" @submit.prevent="submitForm">
      <section class="panel form-panel">
        <div class="panel-header">
          <div>
            <h2>Informacion general</h2>
            <p>Datos base del conjunto y ubicacion.</p>
          </div>
        </div>

        <div class="form-grid">
          <q-input
            v-model="form.name"
            outlined
            dense
            label="Nombre del condominio"
            class="soft-input"
          />
          <q-input
            v-model="form.ruc"
            outlined
            dense
            label="RUC o identificacion"
            class="soft-input"
          />
          <q-input v-model="form.city" outlined dense label="Ciudad" class="soft-input" />
          <q-input v-model="form.sector" outlined dense label="Sector" class="soft-input" />
          <q-input
            v-model="form.address"
            outlined
            dense
            label="Direccion completa"
            class="soft-input form-grid__full"
          />
          <q-input
            v-model.number="form.units"
            outlined
            dense
            type="number"
            label="Total de casas"
            class="soft-input"
          />
          <q-select
            v-model="form.status"
            outlined
            dense
            :options="statusOptions"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            label="Estado operativo"
            class="soft-input"
            :loading="statusLoading"
            :disable="loading || statusLoading"
          />
        </div>
      </section>

      <section class="panel form-panel">
        <div class="panel-header">
          <div>
            <h2>Responsable administrativo</h2>
            <p>Asignacion del administrador principal del condominio.</p>
          </div>
        </div>

        <q-banner v-if="!hasAssignedAdministrator" rounded class="bg-amber-1 text-warning q-mb-md">
          Este condominio aun no tiene un responsable administrativo asignado. Asigna o crea un
          administrador desde la seccion Administradores para mantener la gestion del condominio
          correctamente vinculada.
          <template #action>
            <q-btn
              flat
              color="warning"
              icon="manage_accounts"
              label="Ir a administradores"
              no-caps
              :to="`/condominios/${selectedId}/administradores`"
            />
          </template>
        </q-banner>

        <div v-else class="form-grid">
          <q-input
            v-model="form.adminName"
            outlined
            dense
            label="Administrador principal"
            class="soft-input"
            readonly
          />
          <q-input
            v-model="form.adminEmail"
            outlined
            dense
            type="email"
            label="Correo del administrador"
            class="soft-input"
            readonly
          />
          <q-input
            v-model="form.adminPhone"
            outlined
            dense
            label="Telefono"
            class="soft-input"
            readonly
          />
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
          <q-btn
            type="submit"
            color="primary"
            icon="save"
            label="Guardar cambios"
            no-caps
            :loading="saving"
            :disable="!canSubmit"
          />
          <q-btn outline color="primary" icon="history" label="Ver historial" no-caps />
        </div>
      </aside>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useCatalog } from '../composables/useCatalog';
import type { AdminCondominiumResponse } from '../interfaces/condominiums/condominium.interface';
import type {
  EditCondominiumForm,
  UpdateCondominiumPayload,
} from '../interfaces/edit-condominium/condominium-form.interface';
import { getAdminCondominiumById, updateAdminCondominium } from '../services/condominiums.service';

const route = useRoute();
const operationalStatusCatalogId = '4';
const planOptions = ['Estandar', 'Profesional', 'Corporativo'];
const {
  items: statusOptions,
  loading: statusLoading,
  error: statusError,
  loadCatalog: loadStatusOptions,
} = useCatalog(operationalStatusCatalogId);

const selectedId = String(route.params.id || '1');
const loading = ref(false);
const saving = ref(false);
const error = ref('');

const form = reactive<EditCondominiumForm>({
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
});

function toNumber(value: number | string | undefined, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getTotalHouses(condominium: AdminCondominiumResponse) {
  return toNumber(
    condominium.total_houses ??
      condominium.total_homes ??
      condominium.total_casas ??
      condominium.houses_count ??
      condominium.units ??
      condominium.total_units,
  );
}

function getStatusValue(status: AdminCondominiumResponse['status']) {
  if (status && typeof status === 'object') {
    return String(status.id || status.name || 'Pendiente');
  }

  return status !== undefined && status !== null && status !== '' ? String(status) : 'Pendiente';
}

function toEditForm(condominium: AdminCondominiumResponse): EditCondominiumForm {
  return {
    name: condominium.name || 'Condominio no encontrado',
    ruc: condominium.ruc || '',
    city: condominium.city || '',
    sector: condominium.sector || '',
    address: condominium.address || '',
    units: getTotalHouses(condominium),
    status: getStatusValue(condominium.status),
    adminName:
      condominium.administrator_name ||
      condominium.administrator ||
      condominium.admin_name ||
      'Pendiente',
    adminEmail: condominium.administrator_email || condominium.admin_email || '',
    adminPhone: condominium.administrator_phone || condominium.admin_phone || '',
    plan: condominium.plan || 'Estandar',
  };
}

function assignForm(values: EditCondominiumForm) {
  Object.assign(form, values);
}

const selectedStatusName = computed(() => {
  const selectedStatus = statusOptions.value.find(
    (status) => String(status.id) === String(form.status),
  );
  return selectedStatus?.name || form.status || 'Pendiente';
});

const hasAssignedAdministrator = computed(() => {
  const adminName = form.adminName.trim().toLowerCase();
  return Boolean(adminName) && adminName !== 'pendiente' && adminName !== 'sin administrador';
});

const canSubmit = computed(
  () =>
    Boolean(form.name.trim()) &&
    Boolean(form.ruc.trim()) &&
    Boolean(form.address.trim()) &&
    Boolean(form.city.trim()) &&
    Boolean(form.sector.trim()) &&
    Boolean(getSelectedStatusId()) &&
    Number(form.units) >= 0 &&
    !loading.value &&
    !saving.value,
);

function getSelectedStatusId() {
  const directStatusId = Number(form.status);

  if (Number.isFinite(directStatusId) && directStatusId > 0) {
    return directStatusId;
  }

  const selectedStatus = statusOptions.value.find(
    (status) => String(status.name || status.label || '').toLowerCase() === form.status.toLowerCase(),
  );
  const catalogStatusId = Number(selectedStatus?.id);
  return Number.isFinite(catalogStatusId) && catalogStatusId > 0 ? catalogStatusId : null;
}

async function loadCondominium() {
  loading.value = true;
  error.value = '';

  try {
    const condominium = await getAdminCondominiumById(selectedId);

    if (!condominium) {
      throw new Error('No se encontro el condominio solicitado');
    }

    assignForm(toEditForm(condominium));
  } catch (exception) {
    error.value =
      exception instanceof Error ? exception.message : 'No se pudo cargar el condominio';
  } finally {
    loading.value = false;
  }
}

async function loadPageData() {
  await Promise.all([loadCondominium(), loadStatusOptions()]);

  if (statusError.value) {
    error.value = statusError.value;
  }
}

const summaryItems = computed(() => [
  { icon: 'apartment', label: 'Condominio', value: form.name || 'Sin nombre' },
  {
    icon: 'location_on',
    label: 'Ubicacion',
    value: `${form.city || 'Sin ciudad'} - ${form.sector || 'Sin sector'}`,
  },
  { icon: 'home_work', label: 'Casas', value: `${form.units || 0} casas` },
  { icon: 'verified', label: 'Estado', value: selectedStatusName.value },
  { icon: 'manage_accounts', label: 'Responsable', value: form.adminName || 'Pendiente' },
]);

function buildPayload(): UpdateCondominiumPayload {
  return {
    name: form.name.trim(),
    ruc: form.ruc.trim(),
    address: form.address.trim(),
    city: form.city.trim(),
    sector: form.sector.trim(),
    status_id: Number(getSelectedStatusId()),
    total_houses: Number(form.units),
  };
}

async function submitForm() {
  if (!canSubmit.value) {
    return;
  }

  saving.value = true;
  error.value = '';

  try {
    await updateAdminCondominium(selectedId, buildPayload());
    await loadCondominium();
  } catch (exception) {
    error.value =
      exception instanceof Error ? exception.message : 'No se pudo actualizar el condominio';
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  void loadPageData();
});
</script>

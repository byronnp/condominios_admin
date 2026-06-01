<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Nuevo condominio</p>
        <h1>Crear condominio</h1>
        <p>Registra la informacion base y el estado operativo inicial del condominio.</p>
      </div>

      <div class="heading-actions">
        <q-btn
          outline
          color="primary"
          icon="arrow_back"
          label="Volver"
          to="/condominios"
          no-caps
        />
        <q-btn
          color="primary"
          icon="save"
          label="Guardar condominio"
          no-caps
          :loading="saving"
          :disable="!canSubmit"
          @click="submitForm"
        />
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
          <q-input
            v-model="form.name"
            outlined
            dense
            label="Nombre del condominio"
            class="soft-input"
            :disable="saving"
          />
          <q-input
            v-model="form.ruc"
            outlined
            dense
            label="RUC o identificacion"
            class="soft-input"
            :disable="saving"
          />
          <q-input v-model="form.city" outlined dense label="Ciudad" class="soft-input" :disable="saving" />
          <q-input v-model="form.sector" outlined dense label="Sector" class="soft-input" :disable="saving" />
          <q-input
            v-model="form.address"
            outlined
            dense
            label="Direccion completa"
            class="soft-input form-grid__full"
            :disable="saving"
          />
          <q-select
            v-model="form.statusId"
            outlined
            dense
            :options="statusOptions"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            label="Estado operativo"
            class="soft-input"
            :loading="statusesLoading"
            :disable="saving || statusesLoading"
          />
          <q-input
            v-model.number="form.totalHouses"
            outlined
            dense
            type="number"
            min="0"
            label="Numero de casas"
            class="soft-input"
            :disable="saving"
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

        <q-banner v-if="error" rounded class="bg-red-1 text-negative q-mb-md">
          {{ error }}
        </q-banner>

        <div class="quick-actions summary-actions">
          <q-btn
            type="submit"
            color="primary"
            icon="save"
            label="Guardar condominio"
            no-caps
            :loading="saving"
            :disable="!canSubmit"
          />
        </div>
      </aside>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCatalog } from '../composables/useCatalog';
import type {
  CreateCondominiumForm,
  CreateCondominiumPayload,
} from '../interfaces/create-condominium/condominium-form.interface';
import { createAdminCondominium } from '../services/condominiums.service';

const router = useRouter();
const saving = ref(false);
const error = ref('');
const {
  items: statusItems,
  loading: statusesLoading,
  loadCatalog: loadStatuses,
} = useCatalog('4');

const form = reactive<CreateCondominiumForm>({
  name: '',
  ruc: '',
  city: '',
  sector: '',
  address: '',
  statusId: null,
  totalHouses: null,
});

const statusOptions = computed(() =>
  statusItems.value.map((item) => ({
    value: Number(item.id),
    label: item.name,
  })),
);

const canSubmit = computed(
  () =>
    Boolean(form.name.trim()) &&
    Boolean(form.ruc.trim()) &&
    Boolean(form.address.trim()) &&
    Boolean(form.city.trim()) &&
    Boolean(form.sector.trim()) &&
    Boolean(form.statusId) &&
    form.totalHouses !== null &&
    Number(form.totalHouses) >= 0 &&
    !saving.value,
);

const summaryItems = computed(() => [
  { icon: 'apartment', label: 'Condominio', value: form.name || 'Sin nombre' },
  {
    icon: 'home_work',
    label: 'Casas registradas',
    value: form.totalHouses ? `${form.totalHouses} casas` : 'Sin casas',
  },
  {
    icon: 'verified',
    label: 'Estado',
    value: statusOptions.value.find((option) => option.value === Number(form.statusId))?.label || 'Pendiente',
  },
  { icon: 'location_on', label: 'Ubicacion', value: form.city || 'Sin ciudad' },
]);

function buildPayload(): CreateCondominiumPayload {
  return {
    name: form.name.trim(),
    ruc: form.ruc.trim(),
    address: form.address.trim(),
    city: form.city.trim(),
    sector: form.sector.trim(),
    status_id: Number(form.statusId),
    total_houses: Number(form.totalHouses),
  };
}

async function submitForm() {
  if (!canSubmit.value) {
    return;
  }

  saving.value = true;
  error.value = '';

  try {
    await createAdminCondominium(buildPayload());
    await router.push('/condominios');
  } catch (exception) {
    error.value = exception instanceof Error ? exception.message : 'No se pudo crear el condominio';
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  void loadStatuses();
});
</script>

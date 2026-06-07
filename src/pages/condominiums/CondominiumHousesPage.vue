<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Casas</p>
        <h1>{{ condominium?.name || 'Condominio' }}</h1>
        <p>Administra las casas registradas para este condominio.</p>
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
          icon="add_home"
          label="Crear casa"
          no-caps
          :disable="!condominium"
          @click="openCreateHouse"
        />
      </div>
    </section>

    <section class="panel data-panel">
      <div class="table-toolbar">
        <q-input
          v-model="filter"
          outlined
          dense
          debounce="250"
          placeholder="Buscar casa"
          class="soft-input table-toolbar__search"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <div class="table-toolbar__filters">
          <q-chip outline color="primary" icon="home_work" :label="`${houses.length} casas`" />
        </div>
      </div>

      <q-banner v-if="pageError" rounded class="bg-red-1 text-negative q-mb-md">
        {{ pageError }}
        <template #action>
          <q-btn flat color="negative" label="Reintentar" no-caps @click="loadPage" />
        </template>
      </q-banner>

      <q-banner v-if="error" rounded class="bg-red-1 text-negative q-mb-md">
        {{ error }}
        <template #action>
          <q-btn
            flat
            color="negative"
            label="Reintentar"
            no-caps
            @click="loadHouses(condominiumId)"
          />
        </template>
      </q-banner>

      <q-table
        flat
        :rows="houses"
        :columns="columns"
        row-key="id"
        :filter="filter"
        :loading="loading || condominiumLoading"
        :pagination="{ rowsPerPage: 8 }"
        :grid="$q.screen.lt.md"
        class="soft-table"
      >
        <template #body-cell-houseNumber="props">
          <q-td :props="props">
            <div class="condo-cell">
              <q-avatar color="primary" text-color="white" size="38px">{{
                props.row.houseNumber
              }}</q-avatar>
              <div>
                <strong>{{ props.row.code }}</strong>
                <span>{{ props.row.addressReference }}</span>
              </div>
            </div>
          </q-td>
        </template>

        <template #body-cell-ownerName="props">
          <q-td :props="props">
            <div class="condo-cell">
              <q-avatar color="secondary" text-color="white" size="38px">
                {{ props.row.ownerInitials }}
              </q-avatar>
              <div>
                <strong>{{ props.row.ownerName }}</strong>
                <span>{{ props.row.ownerEmail }}</span>
              </div>
            </div>
          </q-td>
        </template>

        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge
              :color="props.row.statusColor"
              :label="props.row.status"
              class="status-badge"
            />
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props">
            <div class="row-actions">
              <q-btn flat round dense color="primary" icon="edit" @click="openEditHouse(props.row)">
                <q-tooltip>Editar casa</q-tooltip>
              </q-btn>
              <q-btn flat round dense color="primary" icon="person_add" @click="openAssignOwner(props.row)">
                <q-tooltip>Asignar dueño</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>

        <template #item="props">
          <div class="condo-grid-card">
            <div class="condo-grid-card__header">
              <div class="condo-cell">
                <q-avatar color="primary" text-color="white" size="38px">{{
                  props.row.houseNumber
                }}</q-avatar>
              <div>
                <strong>{{ props.row.code }}</strong>
                <span>{{ props.row.addressReference }}</span>
              </div>
            </div>
              <q-badge
                :color="props.row.statusColor"
                :label="props.row.status"
                class="status-badge"
              />
            </div>

            <div class="condo-grid-card__details">
              <span
                >Numero<strong>{{ props.row.houseNumber }}</strong></span
              >
              <span
                >Condominio<strong>{{ props.row.condominiumName }}</strong></span
              >
              <span
                >DueÃ±o<strong>{{ props.row.ownerName }}</strong></span
              >
            </div>

            <div class="row-actions row-actions--mobile">
              <q-btn flat round dense color="primary" icon="edit" @click="openEditHouse(props.row)">
                <q-tooltip>Editar casa</q-tooltip>
              </q-btn>
              <q-btn flat round dense color="primary" icon="person_add" @click="openAssignOwner(props.row)">
                <q-tooltip>Asignar dueño</q-tooltip>
              </q-btn>
            </div>
          </div>
        </template>
      </q-table>
    </section>

    <HouseFormDialog
      v-model="showHouseDialog"
      :condominium-name="condominium?.name || 'Condominio'"
      :house="selectedHouse"
      :loading="saving"
      :error="formError"
      @assign-owner="openAssignOwner"
      @submit="submitHouseForm"
    />

    <AssignHouseOwnerDialog
      v-model="showOwnerDialog"
      :condominium-name="condominium?.name || 'Condominio'"
      :house="selectedHouseForOwner"
      :resident-options="residentOptions"
      :loading="assigningOwner || residentsLoading"
      :error="ownerError || residentsError"
      @submit="submitHouseOwner"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useQuasar, type QTableColumn } from 'quasar';
import { useRoute } from 'vue-router';
import { useCondominiumHouses } from '../../composables/condominiums/useCondominiumHouses';
import { useHouseResidents } from '../../composables/houses/useHouseResidents';
import AssignHouseOwnerDialog from '../houses/components/AssignHouseOwnerDialog.vue';
import HouseFormDialog from '../houses/components/HouseFormDialog.vue';
import type {
  AdminCondominiumResponse,
  CondominiumDetails,
} from '../../interfaces/condominiums/condominium.interface';
import type {
  CreateHousePayload,
  HouseForm,
  UpdateHousePayload,
} from '../../interfaces/houses/house-form.interface';
import type { House } from '../../interfaces/houses/house.interface';
import type { HouseOwnerOption } from '../../interfaces/houses/house-owner.interface';
import { getAdminCondominiumById } from '../../services/condominiums/condominiums.service';
import { createAdminHouse, updateAdminHouse } from '../../services/houses/houses.service';

const route = useRoute();
const $q = useQuasar();
const filter = ref('');
const condominium = ref<CondominiumDetails | null>(null);
const condominiumLoading = ref(false);
const pageError = ref('');
const showHouseDialog = ref(false);
const selectedHouse = ref<House | null>(null);
const showOwnerDialog = ref(false);
const selectedHouseForOwner = ref<House | null>(null);
const saving = ref(false);
const assigningOwner = ref(false);
const formError = ref('');
const ownerError = ref('');
const condominiumId = computed(() => String(route.params.id || ''));
const { houses, loading, error, loadHouses } = useCondominiumHouses();
const {
  residents: residentOptions,
  loading: residentsLoading,
  error: residentsError,
  loadResidents,
} = useHouseResidents();
const columns: QTableColumn<House>[] = [
  { name: 'houseNumber', label: 'Casa', field: 'houseNumber', align: 'left', sortable: true },
  { name: 'code', label: 'Codigo', field: 'code', align: 'left', sortable: true },
  { name: 'ownerName', label: 'DueÃ±o', field: 'ownerName', align: 'left', sortable: true },
  {
    name: 'addressReference',
    label: 'Referencia',
    field: 'addressReference',
    align: 'left',
    sortable: true,
  },
  { name: 'status', label: 'Estado', field: 'status', align: 'left', sortable: true },
  { name: 'actions', label: 'Acciones', field: 'id', align: 'right' },
];

function toNumber(value: number | string | undefined, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function getStatusName(status: AdminCondominiumResponse['status']) {
  if (status && typeof status === 'object') {
    return status.name || String(status.id || 'Activo');
  }

  return status !== undefined && status !== null && status !== '' ? String(status) : 'Activo';
}

function toCondominiumDetails(response: AdminCondominiumResponse): CondominiumDetails {
  const name = response.name || 'Condominio';

  return {
    id: toNumber(response.id),
    initials: getInitials(name) || 'CO',
    name,
    address: response.address || 'Sin direccion registrada',
    city: response.city || 'Sin ciudad',
    administrator:
      response.administrator_name ||
      response.administrator ||
      response.admin_name ||
      'Sin administrador',
    units: toNumber(
      response.total_houses ??
        response.total_homes ??
        response.total_casas ??
        response.houses_count ??
        response.units ??
        response.total_units,
    ),
    occupancy: toNumber(response.occupancy_percentage ?? response.occupancy),
    revenue:
      response.revenue !== undefined
        ? String(response.revenue)
        : String(response.monthly_revenue || '-'),
    status: getStatusName(response.status),
    statusColor: 'positive',
    updatedAt: response.updatedAt || response.updated_at || 'Sin actualizar',
  };
}

async function loadCondominium() {
  condominiumLoading.value = true;
  pageError.value = '';

  try {
    const response = await getAdminCondominiumById(condominiumId.value);
    condominium.value = response ? toCondominiumDetails(response) : null;

    if (!condominium.value) {
      pageError.value = 'No se encontro el condominio seleccionado.';
    }
  } catch (exception) {
    pageError.value =
      exception instanceof Error ? exception.message : 'No se pudo cargar el condominio';
  } finally {
    condominiumLoading.value = false;
  }
}

async function loadPage() {
  await Promise.all([loadCondominium(), loadHouses(condominiumId.value)]);
}

function openCreateHouse() {
  selectedHouse.value = null;
  formError.value = '';
  showHouseDialog.value = true;
}

function openEditHouse(house: House) {
  selectedHouse.value = house;
  formError.value = '';
  showHouseDialog.value = true;
}

async function openAssignOwner(house: House | null = selectedHouse.value) {
  if (!house) {
    return;
  }

  selectedHouseForOwner.value = house;
  ownerError.value = '';
  residentsError.value = '';
  residentOptions.value = [];
  showOwnerDialog.value = true;
  await loadResidents(house.id);
}

function buildCreatePayload(form: HouseForm): CreateHousePayload {
  return {
    condominium_id: Number(condominiumId.value),
    house_number: form.houseNumber,
    address_reference: form.addressReference || null,
    status: form.status || 'active',
  };
}

function buildUpdatePayload(form: HouseForm): UpdateHousePayload {
  return {
    house_number: form.houseNumber,
    address_reference: form.addressReference || null,
    status: form.status || 'active',
  };
}

async function submitHouseForm(form: HouseForm) {
  if (!condominium.value) {
    return;
  }

  saving.value = true;
  formError.value = '';

  try {
    if (selectedHouse.value) {
      await updateAdminHouse(selectedHouse.value.id, buildUpdatePayload(form));
    } else {
      await createAdminHouse(buildCreatePayload(form));
    }

    showHouseDialog.value = false;
    selectedHouse.value = null;
    await loadHouses(condominiumId.value);
  } catch (exception) {
    formError.value = exception instanceof Error ? exception.message : 'No se pudo guardar la casa';
  } finally {
    saving.value = false;
  }
}

function submitHouseOwner(owner: HouseOwnerOption | null) {
  if (!selectedHouseForOwner.value) {
    return;
  }

  assigningOwner.value = true;
  ownerError.value = '';

  try {
    const ownerName = owner?.name || 'Sin dueÃ±o';
    const ownerEmail = owner?.email || 'Sin correo';
    const ownerPhone = 'Sin telefono';
    const ownerInitials = owner?.initials || 'DU';

    houses.value = houses.value.map((house) =>
      house.id === selectedHouseForOwner.value?.id
        ? {
            ...house,
            ownerId: owner?.id ?? null,
            ownerName,
            ownerEmail,
            ownerPhone,
            ownerInitials,
            hasOwner: Boolean(owner),
          }
        : house,
    );

    showOwnerDialog.value = false;
    selectedHouseForOwner.value = null;
  } catch (exception) {
    ownerError.value = exception instanceof Error ? exception.message : 'No se pudo asignar el dueÃ±o';
  } finally {
    assigningOwner.value = false;
  }
}

onMounted(() => {
  void loadPage();
});
</script>

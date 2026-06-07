<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Casas</p>
        <h1>Administracion global</h1>
        <p>Consulta, filtra y reasigna viviendas de todos los condominios.</p>
      </div>

      <div class="heading-actions">
        <q-btn
          color="primary"
          icon="refresh"
          label="Actualizar"
          no-caps
          :loading="housesLoading"
          @click="loadPage"
        />
      </div>
    </section>

    <section class="stats-grid">
      <q-card v-for="item in stats" :key="item.label" class="panel stat-card">
        <q-card-section class="stat-card__body">
          <q-avatar :color="item.color" text-color="white" size="42px">
            <q-icon :name="item.icon" />
          </q-avatar>
          <div>
            <span class="text-caption text-grey-7">{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </div>
        </q-card-section>
      </q-card>
    </section>

    <section class="panel data-panel">
      <div class="table-toolbar">
        <q-input
          v-model="search"
          outlined
          dense
          debounce="250"
          placeholder="Buscar casa, condominio o dueÃ±o"
          class="soft-input table-toolbar__search"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <div class="table-toolbar__filters">
          <q-select
            v-model="condominiumFilter"
            :options="condominiumOptions"
            outlined
            dense
            emit-value
            map-options
            option-label="label"
            option-value="value"
            label="Condominio"
            class="soft-input"
            :disable="!hasCondominiumOptions"
          />
          <q-select
            v-model="statusFilter"
            :options="statusOptions"
            outlined
            dense
            emit-value
            map-options
            option-label="label"
            option-value="value"
            label="Estado"
            class="soft-input"
          />
          <q-select
            v-model="ownerFilter"
            :options="ownerFilterOptions"
            outlined
            dense
            emit-value
            map-options
            option-label="label"
            option-value="value"
            label="DueÃ±o"
            class="soft-input"
          />
        </div>
      </div>

      <q-banner v-if="pageError" rounded class="bg-red-1 text-negative q-mb-md">
        {{ pageError }}
        <template #action>
          <q-btn flat color="negative" label="Reintentar" no-caps @click="loadPage" />
        </template>
      </q-banner>

      <q-banner v-if="emptyState" rounded class="bg-blue-1 text-primary q-mb-md">
        {{ emptyState }}
      </q-banner>

      <q-table
        flat
        :rows="filteredHouses"
        :columns="columns"
        row-key="id"
        :loading="housesLoading"
        :pagination="{ rowsPerPage: 8 }"
        :grid="$q.screen.lt.md"
        class="soft-table"
      >
        <template #body-cell-houseNumber="props">
          <q-td :props="props">
            <div class="condo-cell">
              <q-avatar color="primary" text-color="white" size="38px">
                {{ props.row.houseNumber }}
              </q-avatar>
              <div>
                <strong>{{ props.row.code }}</strong>
                <span>{{ props.row.addressReference }}</span>
              </div>
            </div>
          </q-td>
        </template>

        <template #body-cell-condominiumName="props">
          <q-td :props="props">
            <div class="condo-cell">
              <q-avatar color="secondary" text-color="white" size="38px">
                {{ getCondominiumInitials(props.row.condominiumName) }}
              </q-avatar>
              <div>
                <strong>{{ props.row.condominiumName }}</strong>
                <span>ID {{ props.row.condominiumId }}</span>
              </div>
            </div>
          </q-td>
        </template>

        <template #body-cell-ownerName="props">
          <q-td :props="props">
            <div class="condo-cell">
              <q-avatar :color="props.row.hasOwner ? 'primary' : 'grey-5'" text-color="white" size="38px">
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
              <q-btn flat round dense color="primary" icon="edit" :disable="!props.row.actions.edit" @click="openEditHouse(props.row)">
                <q-tooltip>Editar casa</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="person_add"
                :disable="!props.row.actions.assign_resident"
                @click="openAssignOwner(props.row)"
              >
                <q-tooltip>Asignar dueño</q-tooltip>
              </q-btn>
              <q-btn flat round dense color="primary" icon="person_add" :disable="!props.row.actions.invite_user" @click="goToCreateOwner(props.row)">
                <q-tooltip>Nuevo dueño</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>

        <template #item="props">
          <div class="condo-grid-card">
            <div class="condo-grid-card__header">
              <div class="condo-cell">
                <q-avatar color="primary" text-color="white" size="38px">
                  {{ props.row.houseNumber }}
                </q-avatar>
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
              <span>Condominio<strong>{{ props.row.condominiumName }}</strong></span>
              <span>DueÃ±o<strong>{{ props.row.ownerName }}</strong></span>
              <span>Estado<strong>{{ props.row.status }}</strong></span>
            </div>

            <div class="row-actions row-actions--mobile">
              <q-btn flat round dense color="primary" icon="edit" :disable="!props.row.actions.edit" @click="openEditHouse(props.row)">
                <q-tooltip>Editar casa</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="person_add"
                :disable="!props.row.actions.assign_resident"
                @click="openAssignOwner(props.row)"
              >
                <q-tooltip>Asignar dueño</q-tooltip>
              </q-btn>
              <q-btn flat round dense color="primary" icon="person_add" :disable="!props.row.actions.invite_user" @click="goToCreateOwner(props.row)">
                <q-tooltip>Nuevo dueño</q-tooltip>
              </q-btn>
            </div>
          </div>
        </template>
      </q-table>
    </section>

    <AssignHouseOwnerDialog
      v-model="showOwnerDialog"
      :condominium-name="selectedHouse?.condominiumName || 'Condominio'"
      :house="selectedHouse"
      :resident-options="residentOptions"
      :loading="assigningOwner || residentsLoading"
      :error="ownerError || residentsError"
      @submit="submitHouseOwner"
    />

    <HouseFormDialog
      v-model="showHouseDialog"
      :condominium-name="selectedHouseForEdit?.condominiumName || 'Condominio'"
      :house="selectedHouseForEdit"
      :loading="savingHouse"
      :error="houseFormError"
      @assign-owner="openAssignOwner"
      @submit="submitHouseForm"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { QTableColumn } from 'quasar';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import AssignHouseOwnerDialog from 'pages/houses/components/AssignHouseOwnerDialog.vue';
import HouseFormDialog from 'pages/houses/components/HouseFormDialog.vue';
import { useAdminHouses } from '../../composables/houses/useAdminHouses';
import { useHouseResidents } from '../../composables/houses/useHouseResidents';
import type { HouseOwnerOption } from '../../interfaces/houses/house-owner.interface';
import type { HouseForm, UpdateHousePayload } from '../../interfaces/houses/house-form.interface';
import type { House } from '../../interfaces/houses/house.interface';
import { updateAdminHouse } from '../../services/houses/houses.service';

const router = useRouter();
const $q = useQuasar();

const search = ref('');
const condominiumFilter = ref('all');
const statusFilter = ref('all');
const ownerFilter = ref('all');
const pageError = ref('');
const showOwnerDialog = ref(false);
const selectedHouse = ref<House | null>(null);
const showHouseDialog = ref(false);
const selectedHouseForEdit = ref<House | null>(null);
const assigningOwner = ref(false);
const ownerError = ref('');
const savingHouse = ref(false);
const houseFormError = ref('');

const {
  residents: residentOptions,
  loading: residentsLoading,
  error: residentsError,
  loadResidents,
} = useHouseResidents();

const { houses, loading: housesLoading, error: housesError, loadHouses } = useAdminHouses();

const columns: QTableColumn<House>[] = [
  { name: 'houseNumber', label: 'Casa', field: 'houseNumber', align: 'left', sortable: true },
  {
    name: 'condominiumName',
    label: 'Condominio',
    field: 'condominiumName',
    align: 'left',
    sortable: true,
  },
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

const statusOptions = [
  { label: 'Todos los estados', value: 'all' },
  { label: 'Activa', value: 'active' },
  { label: 'Inactiva', value: 'inactive' },
  { label: 'Pendiente', value: 'pending' },
];

const ownerFilterOptions = [
  { label: 'Todos los dueÃ±os', value: 'all' },
  { label: 'Con dueÃ±o', value: 'with-owner' },
  { label: 'Sin dueÃ±o', value: 'without-owner' },
];

const condominiumOptions = computed(() => {
  const uniqueOptions = new Map<string, { label: string; value: string }>();

  houses.value.forEach((house) => {
    if (house.condominiumId <= 0) {
      return;
    }

    const value = String(house.condominiumId);
    if (!uniqueOptions.has(value)) {
      uniqueOptions.set(value, {
        label: house.condominiumName || 'Condominio',
        value,
      });
    }
  });

  return [{ label: 'Todos los condominios', value: 'all' }, ...Array.from(uniqueOptions.values())];
});

const hasCondominiumOptions = computed(() => condominiumOptions.value.length > 1);

const filteredHouses = computed(() =>
  houses.value.filter((house) => {
    const query = search.value.trim().toLowerCase();
    const matchesSearch =
      !query ||
      [
        house.houseNumber,
        house.code,
        house.condominiumName,
        house.ownerName,
        house.ownerEmail,
        house.addressReference,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query);

    const matchesCondominium =
      condominiumFilter.value === 'all' ||
      String(house.condominiumId) === String(condominiumFilter.value);

    const matchesStatus =
      statusFilter.value === 'all' || matchesStatusFilter(house.status, statusFilter.value);

    const matchesOwner =
      ownerFilter.value === 'all' ||
      (ownerFilter.value === 'with-owner' && house.hasOwner) ||
      (ownerFilter.value === 'without-owner' && !house.hasOwner);

    return matchesSearch && matchesCondominium && matchesStatus && matchesOwner;
  }),
);

const stats = computed(() => [
  {
    label: 'Casas',
    value: String(houses.value.length),
    icon: 'home_work',
    color: 'primary',
  },
  {
    label: 'Con dueÃ±o',
    value: String(houses.value.filter((house) => house.hasOwner).length),
    icon: 'person',
    color: 'positive',
  },
  {
    label: 'Sin dueÃ±o',
    value: String(houses.value.filter((house) => !house.hasOwner).length),
    icon: 'person_off',
    color: 'warning',
  },
  {
    label: 'Condominios',
    value: String(new Set(houses.value.map((house) => house.condominiumId).filter((value) => value > 0)).size),
    icon: 'apartment',
    color: 'secondary',
  },
]);

const emptyState = computed(() => {
  if (housesLoading.value) {
    return '';
  }

  if (filteredHouses.value.length > 0) {
    return '';
  }

  if (
    search.value ||
    condominiumFilter.value !== 'all' ||
    statusFilter.value !== 'all' ||
    ownerFilter.value !== 'all'
  ) {
    return 'No hay casas que coincidan con los filtros actuales.';
  }

  return 'Aun no hay casas registradas para mostrar en la vista global.';
});

function normalizeStatus(status: string) {
  return status
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function matchesStatusFilter(status: string, filterValue: string) {
  const normalizedStatus = normalizeStatus(status);

  if (filterValue === 'active') {
    return normalizedStatus.includes('active') || normalizedStatus.includes('activo');
  }

  if (filterValue === 'inactive') {
    return normalizedStatus.includes('inactive') || normalizedStatus.includes('inactivo');
  }

  if (filterValue === 'pending') {
    return normalizedStatus.includes('pending') || normalizedStatus.includes('pendiente');
  }

  return true;
}

function getCondominiumInitials(name: string) {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'CO'
  );
}

async function loadPage() {
  pageError.value = '';
  await loadHouses();

  if (housesError.value) {
    pageError.value = housesError.value;
  }
}

async function openAssignOwner(house: House | null) {
  if (!house) {
    return;
  }

  selectedHouse.value = house;
  ownerError.value = '';
  residentsError.value = '';
  residentOptions.value = [];
  showOwnerDialog.value = true;
  await loadResidents(house.id);
}

function openEditHouse(house: House) {
  selectedHouseForEdit.value = house;
  houseFormError.value = '';
  showHouseDialog.value = true;
}

function buildUpdatePayload(form: HouseForm): UpdateHousePayload {
  return {
    house_number: form.houseNumber,
    address_reference: form.addressReference || null,
    status: form.status || 'active',
  };
}

function submitHouseOwner(owner: HouseOwnerOption | null) {
  if (!selectedHouse.value) {
    return;
  }

  assigningOwner.value = true;
  ownerError.value = '';

  try {
    const ownerName = owner?.name || 'Sin dueÃ±o';
    const ownerEmail = owner?.email || 'Sin correo';
    const ownerPhone = 'Sin telÃ©fono';
    const ownerInitials = owner?.initials || 'DU';

    houses.value = houses.value.map((house) =>
      house.id === selectedHouse.value?.id
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
    selectedHouse.value = null;
  } catch (exception) {
    ownerError.value = exception instanceof Error ? exception.message : 'No se pudo asignar el dueÃ±o';
  } finally {
    assigningOwner.value = false;
  }
}

async function submitHouseForm(form: HouseForm) {
  if (!selectedHouseForEdit.value) {
    return;
  }

  savingHouse.value = true;
  houseFormError.value = '';

  try {
    await updateAdminHouse(selectedHouseForEdit.value.id, buildUpdatePayload(form));
    showHouseDialog.value = false;
    selectedHouseForEdit.value = null;
    await loadPage();
  } catch (exception) {
    houseFormError.value = exception instanceof Error ? exception.message : 'No se pudo guardar la casa';
  } finally {
    savingHouse.value = false;
  }
}

function goToCreateOwner(house: House) {
  void router.push({
    path: '/admin/casas/duenos/nuevo',
    query: {
      house_id: String(house.id),
      condominium: house.condominiumName,
      house_label: house.code,
    },
  });
}

onMounted(() => {
  void loadPage();
});
</script>

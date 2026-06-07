<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Residentes</p>
        <h1>Administracion de residentes</h1>
        <p>Consulta, edita y elimina residentes vinculados a una vivienda.</p>
      </div>

      <div class="heading-actions">
        <q-btn outline color="primary" icon="download" label="Exportar" no-caps />
        <q-btn color="primary" icon="person_add" label="Nuevo residente" to="/residentes/nuevo" no-caps />
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
          v-model="filter"
          outlined
          dense
          debounce="250"
          placeholder="Buscar residente, cédula o casa"
          class="soft-input table-toolbar__search"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <div class="table-toolbar__filters">
          <q-select
            v-model="statusFilter"
            :options="statusOptions"
            outlined
            dense
            emit-value
            map-options
            label="Estado"
            class="soft-input"
          />
          <q-select
            v-model="roleFilter"
            :options="roleOptions"
            outlined
            dense
            emit-value
            map-options
            label="Relacion"
            class="soft-input"
          />
          <q-chip outline color="primary" icon="groups" :label="`${residents.length} residentes`" />
        </div>
      </div>

      <q-banner v-if="emptyState" rounded class="bg-blue-1 text-primary q-mb-md">
        {{ emptyState }}
      </q-banner>

      <q-table
        flat
        :rows="filteredResidents"
        :columns="columns"
        row-key="id"
        :filter="filter"
        :grid="$q.screen.lt.md"
        class="soft-table"
      >
        <template #body-cell-name="props">
          <q-td :props="props">
            <div class="condo-cell">
              <q-avatar color="primary" text-color="white" size="38px">
                {{ props.row.initials }}
              </q-avatar>
              <div>
                <strong>{{ props.row.name }}</strong>
                <span>{{ props.row.email }}</span>
              </div>
            </div>
          </q-td>
        </template>

        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="props.row.statusColor" :label="props.row.status" class="status-badge" />
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props">
            <div class="row-actions">
              <q-btn flat round dense color="primary" icon="visibility" @click="openDetails(props.row)">
                <q-tooltip>Ver detalle</q-tooltip>
              </q-btn>
              <q-btn flat round dense color="primary" icon="edit" :to="`/residentes/${props.row.id}/editar`">
                <q-tooltip>Editar residente</q-tooltip>
              </q-btn>
              <q-btn flat round dense color="negative" icon="delete" @click="confirmDelete(props.row)">
                <q-tooltip>Eliminar residente</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>

        <template #item="props">
          <div class="condo-grid-card">
            <div class="condo-grid-card__header">
              <div class="condo-cell">
                <q-avatar color="primary" text-color="white" size="38px">
                  {{ props.row.initials }}
                </q-avatar>
                <div>
                  <strong>{{ props.row.name }}</strong>
                  <span>{{ props.row.email }}</span>
                </div>
              </div>
              <q-badge :color="props.row.statusColor" :label="props.row.status" class="status-badge" />
            </div>

            <div class="condo-grid-card__details">
              <span>Casa<strong>{{ props.row.house }}</strong></span>
              <span>Condominio<strong>{{ props.row.condominium }}</strong></span>
              <span>Relacion<strong>{{ props.row.relationship }}</strong></span>
              <span>Telefono<strong>{{ props.row.phone }}</strong></span>
            </div>

            <div class="row-actions row-actions--mobile">
              <q-btn flat round dense color="primary" icon="visibility" @click="openDetails(props.row)">
                <q-tooltip>Ver detalle</q-tooltip>
              </q-btn>
              <q-btn flat round dense color="primary" icon="edit" :to="`/residentes/${props.row.id}/editar`">
                <q-tooltip>Editar residente</q-tooltip>
              </q-btn>
              <q-btn flat round dense color="negative" icon="delete" @click="confirmDelete(props.row)">
                <q-tooltip>Eliminar residente</q-tooltip>
              </q-btn>
            </div>
          </div>
        </template>
      </q-table>
    </section>

    <ResidentDetailsDialog v-model="showDetailsDialog" :resident="selectedResident" @edit="goToEdit" />

    <ConfirmDialog
      v-model="showDeleteDialog"
      title="Eliminar residente"
      :message="deleteDialogMessage"
      subtitle="Confirma antes de eliminar este registro."
      hint="Esta accion solo afecta el listado mock. Luego se puede conectar al backend real."
      confirm-label="Eliminar"
      cancel-label="Cancelar"
      confirm-color="negative"
      confirm-icon="delete"
      icon="delete"
      icon-color="negative"
      @confirm="deleteSelectedResident"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { QTableColumn } from 'quasar';
import { useRouter } from 'vue-router';
import ResidentDetailsDialog from 'components/dialogs/ResidentDetailsDialog.vue';
import ConfirmDialog from 'components/general/ConfirmDialog.vue';
import type { ResidentDetails } from '../interfaces/residents/resident.interface';

const router = useRouter();
const filter = ref('');
const statusFilter = ref('all');
const roleFilter = ref('all');
const showDetailsDialog = ref(false);
const showDeleteDialog = ref(false);
const selectedResident = ref<ResidentDetails | null>(null);
const residentToDelete = ref<ResidentDetails | null>(null);

const residents = ref<ResidentDetails[]>([
  {
    id: 1,
    initials: 'DP',
    name: 'Daniel Perez',
    email: 'daniel@email.com',
    identificationType: 'Cedula',
    identificationNumber: '0901234567',
    phone: '0991234567',
    condominium: 'Mirador Norte',
    house: 'Casa B-14',
    relationship: 'Propietario',
    role: 'Residente',
    status: 'Activo',
    statusColor: 'positive',
    lastActivity: 'Hoy',
  },
  {
    id: 2,
    initials: 'LC',
    name: 'Lucia Castro',
    email: 'lucia@email.com',
    identificationType: 'Pasaporte',
    identificationNumber: 'P-889233',
    phone: '0987771122',
    condominium: 'Portal del Bosque',
    house: 'Depto 302',
    relationship: 'Conyuge',
    role: 'Propietario',
    status: 'Activo',
    statusColor: 'positive',
    lastActivity: 'Ayer',
  },
  {
    id: 3,
    initials: 'RM',
    name: 'Rafael Mora',
    email: 'rafael@email.com',
    identificationType: 'Cedula',
    identificationNumber: '1719988776',
    phone: '0998887766',
    condominium: 'Las Cumbres',
    house: 'Casa A-07',
    relationship: 'Arrendatario',
    role: 'Residente',
    status: 'Pendiente',
    statusColor: 'warning',
    lastActivity: 'Sin ingreso',
  },
  {
    id: 4,
    initials: 'AV',
    name: 'Ana Vera',
    email: 'ana@email.com',
    identificationType: 'Cedula',
    identificationNumber: '0914455667',
    phone: '0993344556',
    condominium: 'Riberas del Austro',
    house: 'Casa C-11',
    relationship: 'Familiar',
    role: 'Residente',
    status: 'Activo',
    statusColor: 'positive',
    lastActivity: '12 mayo',
  },
]);

const columns: QTableColumn<ResidentDetails>[] = [
  { name: 'name', label: 'Residente', field: 'name', align: 'left', sortable: true },
  { name: 'condominium', label: 'Condominio', field: 'condominium', align: 'left', sortable: true },
  { name: 'house', label: 'Casa', field: 'house', align: 'left', sortable: true },
  { name: 'relationship', label: 'Relacion', field: 'relationship', align: 'left', sortable: true },
  { name: 'status', label: 'Estado', field: 'status', align: 'left', sortable: true },
  { name: 'actions', label: 'Acciones', field: 'id', align: 'right' },
];

const statusOptions = [
  { label: 'Todos los estados', value: 'all' },
  { label: 'Activo', value: 'Activo' },
  { label: 'Pendiente', value: 'Pendiente' },
  { label: 'Inactivo', value: 'Inactivo' },
];

const roleOptions = [
  { label: 'Todas las relaciones', value: 'all' },
  { label: 'Propietario', value: 'Propietario' },
  { label: 'Conyuge', value: 'Conyuge' },
  { label: 'Familiar', value: 'Familiar' },
  { label: 'Arrendatario', value: 'Arrendatario' },
];

const filteredResidents = computed(() =>
  residents.value.filter((resident) => {
    const query = filter.value.trim().toLowerCase();
    const matchesSearch =
      !query ||
      [
        resident.name,
        resident.email,
        resident.identificationNumber,
        resident.house,
        resident.condominium,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query);

    const matchesStatus = statusFilter.value === 'all' || resident.status === statusFilter.value;
    const matchesRole = roleFilter.value === 'all' || resident.relationship === roleFilter.value;

    return matchesSearch && matchesStatus && matchesRole;
  }),
);

const stats = computed(() => [
  { label: 'Residentes', value: String(residents.value.length), icon: 'groups', color: 'primary' },
  {
    label: 'Activos',
    value: String(residents.value.filter((resident) => resident.status === 'Activo').length),
    icon: 'verified',
    color: 'positive',
  },
  {
    label: 'Pendientes',
    value: String(residents.value.filter((resident) => resident.status === 'Pendiente').length),
    icon: 'pending_actions',
    color: 'warning',
  },
  {
    label: 'Con propietario',
    value: String(residents.value.filter((resident) => resident.relationship === 'Propietario').length),
    icon: 'person',
    color: 'secondary',
  },
]);

const emptyState = computed(() => {
  if (filteredResidents.value.length > 0) {
    return '';
  }

  if (filter.value || statusFilter.value !== 'all' || roleFilter.value !== 'all') {
    return 'No hay residentes que coincidan con los filtros actuales.';
  }

  return 'Aun no hay residentes cargados.';
});

function openDetails(resident: ResidentDetails) {
  selectedResident.value = resident;
  showDetailsDialog.value = true;
}

function goToEdit(id: number) {
  showDetailsDialog.value = false;
  void router.push(`/residentes/${id}/editar`);
}

function confirmDelete(resident: ResidentDetails) {
  residentToDelete.value = resident;
  showDeleteDialog.value = true;
}

function deleteSelectedResident() {
  if (!residentToDelete.value) {
    return;
  }

  const index = residents.value.findIndex((item) => item.id === residentToDelete.value?.id);
  if (index >= 0) {
    residents.value.splice(index, 1);
  }

  residentToDelete.value = null;
  showDeleteDialog.value = false;
}

const deleteDialogMessage = computed(() =>
  residentToDelete.value
    ? `Vas a eliminar a ${residentToDelete.value.name}. Esta accion no se puede deshacer.`
    : 'Vas a eliminar este residente. Esta accion no se puede deshacer.',
);
</script>

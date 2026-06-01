<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Administradores</p>
        <h1>{{ condominium?.name || 'Condominio' }}</h1>
        <p>Gestiona los administradores asignados a este condominio.</p>
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
          icon="person_add"
          label="Crear administrador"
          no-caps
          :disable="!condominium"
          @click="openCreateAdmin"
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
          placeholder="Buscar administrador"
          class="soft-input table-toolbar__search"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <div class="table-toolbar__filters">
          <q-chip
            outline
            color="primary"
            icon="manage_accounts"
            :label="`${admins.length} administradores`"
          />
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
            @click="loadAdmins(condominiumId)"
          />
        </template>
      </q-banner>

      <q-table
        flat
        :rows="admins"
        :columns="columns"
        row-key="id"
        :filter="filter"
        :loading="loading || condominiumLoading"
        :pagination="{ rowsPerPage: 8 }"
        :grid="$q.screen.lt.md"
        class="soft-table"
      >
        <template #body-cell-name="props">
          <q-td :props="props">
            <div class="condo-cell">
              <q-avatar color="primary" text-color="white" size="38px">{{
                props.row.initials
              }}</q-avatar>
              <div>
                <strong>{{ props.row.name }}</strong>
                <span>{{ props.row.identificationNumber }}</span>
              </div>
            </div>
          </q-td>
        </template>

        <template #body-cell-permissions="props">
          <q-td :props="props">
            <div class="admin-list__permissions">
              <q-badge
                v-for="permission in props.row.permissions"
                :key="permission"
                outline
                color="primary"
                :label="permission"
              />
              <q-badge
                v-if="!props.row.permissions.length"
                outline
                color="grey"
                label="Sin permisos"
              />
            </div>
          </q-td>
        </template>

        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge outline color="positive" :label="props.row.status" />
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props">
            <div class="row-actions">
              <q-btn
                flat
                color="primary"
                icon="edit"
                label="Editar"
                no-caps
                @click="openEditAdmin(props.row)"
              />
              <q-btn
                flat
                color="negative"
                icon="delete"
                label="Eliminar"
                no-caps
                :loading="deletingId === props.row.id"
                :disable="deletingId !== null && deletingId !== props.row.id"
                @click="deleteAdmin(props.row)"
              />
            </div>
          </q-td>
        </template>

        <template #item="props">
          <div class="condo-grid-card">
            <div class="condo-grid-card__header">
              <div class="condo-cell">
                <q-avatar color="primary" text-color="white" size="38px">{{
                  props.row.initials
                }}</q-avatar>
                <div>
                  <strong>{{ props.row.name }}</strong>
                  <span>{{ props.row.email }}</span>
                </div>
              </div>
              <q-badge outline color="positive" :label="props.row.status" />
            </div>

            <div class="condo-grid-card__details">
              <span
                >Identificacion<strong>{{ props.row.identificationNumber }}</strong></span
              >
              <span
                >Celular<strong>{{ props.row.phone }}</strong></span
              >
            </div>

            <div class="admin-list__permissions">
              <q-badge
                v-for="permission in props.row.permissions"
                :key="permission"
                outline
                color="primary"
                :label="permission"
              />
              <q-badge
                v-if="!props.row.permissions.length"
                outline
                color="grey"
                label="Sin permisos"
              />
            </div>

            <div class="row-actions row-actions--mobile">
              <q-btn
                flat
                color="primary"
                icon="edit"
                label="Editar"
                no-caps
                @click="openEditAdmin(props.row)"
              />
              <q-btn
                flat
                color="negative"
                icon="delete"
                label="Eliminar"
                no-caps
                :loading="deletingId === props.row.id"
                :disable="deletingId !== null && deletingId !== props.row.id"
                @click="deleteAdmin(props.row)"
              />
            </div>
          </div>
        </template>
      </q-table>
    </section>

    <AssignCondominiumAdminDialog
      v-model="showAdminDialog"
      :condominium="condominium"
      :admin="selectedAdmin"
      :mode="selectedAdmin ? 'edit' : 'create'"
      :loading="saving"
      :error="formError"
      @submit="submitAdminForm"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useQuasar, type QTableColumn } from 'quasar';
import { useRoute } from 'vue-router';
import AssignCondominiumAdminDialog from 'components/dialogs/AssignCondominiumAdminDialog.vue';
import { useCondominiumAdmins } from '../composables/useCondominiumAdmins';
import type {
  CreateCondominiumAdminPayload,
  UpdateCondominiumAdminPayload,
} from '../interfaces/administrators/administrator-form.interface';
import type { CondominiumAdmin } from '../interfaces/administrators/administrator.interface';
import type {
  AdminCondominiumResponse,
  CondominiumDetails,
} from '../interfaces/condominiums/condominium.interface';
import {
  createCondominiumAdmin,
  getAdminCondominiumById,
  updateCondominiumAdmin,
} from '../services/condominiums.service';

const route = useRoute();
const $q = useQuasar();
const filter = ref('');
const condominium = ref<CondominiumDetails | null>(null);
const condominiumLoading = ref(false);
const pageError = ref('');
const showAdminDialog = ref(false);
const selectedAdmin = ref<CondominiumAdmin | null>(null);
const saving = ref(false);
const formError = ref('');
const condominiumId = computed(() => String(route.params.id || ''));
const { admins, loading, deletingId, error, loadAdmins, removeAdmin } = useCondominiumAdmins();

const columns: QTableColumn<CondominiumAdmin>[] = [
  { name: 'name', label: 'Administrador', field: 'name', align: 'left', sortable: true },
  { name: 'email', label: 'Correo', field: 'email', align: 'left', sortable: true },
  { name: 'phone', label: 'Celular', field: 'phone', align: 'left', sortable: true },
  { name: 'permissions', label: 'Permisos', field: 'permissions', align: 'left' },
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
  await Promise.all([loadCondominium(), loadAdmins(condominiumId.value)]);
}

function openCreateAdmin() {
  selectedAdmin.value = null;
  formError.value = '';
  showAdminDialog.value = true;
}

function openEditAdmin(admin: CondominiumAdmin) {
  console.info('Datos enviados al formulario de editar administrador', admin);
  selectedAdmin.value = admin;
  formError.value = '';
  showAdminDialog.value = true;
}

async function submitAdminForm(
  payload: CreateCondominiumAdminPayload | UpdateCondominiumAdminPayload,
) {
  if (!condominium.value) {
    return;
  }

  saving.value = true;
  formError.value = '';

  try {
    if (selectedAdmin.value) {
      await updateCondominiumAdmin(condominiumId.value, selectedAdmin.value.id, payload);
    } else {
      await createCondominiumAdmin(condominiumId.value, payload as CreateCondominiumAdminPayload);
    }

    showAdminDialog.value = false;
    selectedAdmin.value = null;
    await loadAdmins(condominiumId.value);
  } catch (exception) {
    formError.value =
      exception instanceof Error ? exception.message : 'No se pudo guardar el administrador';
  } finally {
    saving.value = false;
  }
}

function deleteAdmin(admin: CondominiumAdmin) {
  $q.dialog({
    title: 'Eliminar administrador',
    message: `¿Deseas eliminar a ${admin.name}? Esta accion no se puede deshacer.`,
    cancel: {
      flat: true,
      color: 'primary',
      label: 'Cancelar',
      noCaps: true,
    },
    ok: {
      color: 'negative',
      icon: 'delete',
      label: 'Eliminar',
      noCaps: true,
    },
    persistent: true,
  }).onOk(() => {
    void removeAdmin(condominiumId.value, admin.id);
  });
}

onMounted(() => {
  void loadPage();
});
</script>

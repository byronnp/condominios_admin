<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Gestion de roles</p>
        <h1>Roles del sistema</h1>
        <p>Consulta, crea y actualiza los roles, su alcance y los permisos asignados.</p>
      </div>

      <div class="heading-actions">
        <q-btn outline color="primary" icon="refresh" label="Recargar" no-caps :disable="loading" @click="loadRoles" />
        <q-btn color="primary" icon="add_moderator" label="Nuevo rol" no-caps @click="openCreateRole" />
      </div>
    </section>

    <q-banner v-if="selectedCondominiumLabel" rounded class="bg-blue-1 text-primary q-mb-md roles-context-banner">
      <div class="roles-context-banner__content">
        <div>
          <strong>Creacion de roles por condominio</strong>
          <p>El formulario se abrira con el condominio {{ selectedCondominiumLabel }} preseleccionado.</p>
        </div>
        <q-chip outline color="primary" icon="apartment" label="Alcance condominio" />
      </div>
    </q-banner>

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

    <section class="panel roles-info-panel">
      <div class="roles-info-panel__copy">
        <p class="eyebrow">Asignacion de permisos</p>
        <h2>Los permisos se agrupan por modulo para que la lectura sea mas clara</h2>
        <p>
          El formulario de rol permite elegir alcance de sistema o condominio. Cuando se selecciona
          condominio, el rol queda asociado a una sola unidad operativa.
        </p>
      </div>
      <div class="roles-info-panel__chips">
        <q-chip outline color="primary" icon="verified_user" :label="`${rolesWithPermissions} roles con permisos`" />
        <q-chip outline color="secondary" icon="list_alt" :label="`${permissions.length} permisos catalogados`" />
        <q-chip outline color="accent" icon="apartment" :label="`${condominiums.length} condominios`" />
      </div>
    </section>

    <section class="panel data-panel">
      <div class="table-toolbar">
        <q-input
          v-model="filter"
          outlined
          dense
          debounce="250"
          placeholder="Buscar rol o alcance"
          class="soft-input table-toolbar__search"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <div class="table-toolbar__filters">
          <q-chip outline color="primary" icon="admin_panel_settings" :label="`${roles.length} roles`" />
          <q-chip outline color="positive" icon="apartment" :label="`${condominiumRoles} de condominio`" />
          <q-chip outline color="secondary" icon="public" :label="`${systemRoles} de sistema`" />
        </div>
      </div>

      <q-banner v-if="error" rounded class="bg-red-1 text-negative q-mb-md">
        {{ error }}
        <template #action>
          <q-btn flat color="negative" label="Reintentar" no-caps @click="loadRoles" />
        </template>
      </q-banner>

      <q-table
        flat
        :rows="roles"
        :columns="columns"
        row-key="id"
        :filter="filter"
        :loading="loading"
        :pagination="{ rowsPerPage: 8 }"
        :grid="$q.screen.lt.md"
        class="soft-table"
      >
        <template #body-cell-name="props">
          <q-td :props="props">
            <div class="condo-cell">
              <q-avatar color="primary" text-color="white" size="38px">
                {{ getInitials(props.row.displayName) }}
              </q-avatar>
              <div>
                <strong>{{ props.row.displayName }}</strong>
                <span>{{ props.row.name }}</span>
              </div>
            </div>
          </q-td>
        </template>

        <template #body-cell-scope="props">
          <q-td :props="props">
            <q-badge outline :color="scopeBadgeColor(props.row.scope)" :label="scopeLabel(props.row.scope)" />
          </q-td>
        </template>

        <template #body-cell-condominium="props">
          <q-td :props="props">
            <span>{{ props.row.condominiumName || 'Global' }}</span>
          </q-td>
        </template>

        <template #body-cell-permissionsCount="props">
          <q-td :props="props">
            <q-badge color="primary" :label="`${props.row.permissionsCount} permisos`" class="status-badge" />
          </q-td>
        </template>

        <template #body-cell-updatedAt="props">
          <q-td :props="props">
            {{ props.row.updatedAt }}
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props">
            <div class="row-actions">
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="verified_user"
                :loading="permissionsSavingId === props.row.id"
                :disable="permissionsLoading"
                @click="openPermissions(props.row)"
              >
                <q-tooltip>Gestionar permisos</q-tooltip>
              </q-btn>
              <q-btn flat round dense color="primary" icon="edit" @click="openEditRole(props.row)">
                <q-tooltip>Editar rol</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="negative"
                icon="delete"
                :loading="deletingId === props.row.id"
                :disable="deletingId !== null && deletingId !== props.row.id"
                @click="confirmDelete(props.row)"
              >
                <q-tooltip>Eliminar rol</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>

        <template #item="props">
          <div class="condo-grid-card">
            <div class="condo-grid-card__header">
              <div class="condo-cell">
                <q-avatar color="primary" text-color="white" size="38px">
                  {{ getInitials(props.row.displayName) }}
                </q-avatar>
                <div>
                  <strong>{{ props.row.displayName }}</strong>
                  <span>{{ props.row.description || props.row.name }}</span>
                </div>
              </div>
              <q-badge outline :color="scopeBadgeColor(props.row.scope)" :label="scopeLabel(props.row.scope)" />
            </div>

            <div class="condo-grid-card__details">
              <span>Nombre tecnico<strong>{{ props.row.name }}</strong></span>
              <span>Alcance<strong>{{ scopeLabel(props.row.scope) }}</strong></span>
              <span>Condominio<strong>{{ props.row.condominiumName || 'Global' }}</strong></span>
              <span>Permisos<strong>{{ props.row.permissionsCount }}</strong></span>
            </div>

            <div class="row-actions row-actions--mobile">
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="verified_user"
                :loading="permissionsSavingId === props.row.id"
                :disable="permissionsLoading"
                @click="openPermissions(props.row)"
              >
                <q-tooltip>Gestionar permisos</q-tooltip>
              </q-btn>
              <q-btn flat round dense color="primary" icon="edit" @click="openEditRole(props.row)">
                <q-tooltip>Editar rol</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="negative"
                icon="delete"
                :loading="deletingId === props.row.id"
                :disable="deletingId !== null && deletingId !== props.row.id"
                @click="confirmDelete(props.row)"
              >
                <q-tooltip>Eliminar rol</q-tooltip>
              </q-btn>
            </div>
          </div>
        </template>
      </q-table>
    </section>

    <RoleFormDialog
      v-model="showRoleDialog"
      :role="selectedRole"
      :saving="saving"
      :condominiums="condominiumOptions"
      :condominiums-loading="condominiumsLoading"
      :initial-scope="roleInitialScope"
      :initial-condominium-id="roleInitialCondominiumId"
      :initial-condominium-name="selectedCondominiumLabel"
      @save="saveRoleHandler"
    />

    <ConfirmDialog
      v-model="showDeleteDialog"
      title="Eliminar rol"
      :message="deleteDialogMessage"
      subtitle="Confirma antes de continuar."
      hint="Esta accion solo afecta el registro seleccionado."
      confirm-label="Eliminar"
      cancel-label="Cancelar"
      confirm-color="negative"
      confirm-icon="delete"
      icon="delete"
      icon-color="negative"
      @confirm="deleteSelectedRole"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { QTableColumn } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import RoleFormDialog from './components/RoleFormDialog.vue';
import ConfirmDialog from 'components/general/ConfirmDialog.vue';
import { useRoles } from '../../composables/roles/useRoles';
import { useCondominiums } from '../../composables/condominiums/useCondominiums';
import type { RoleDetails } from '../../interfaces/roles/role.interface';
import type { RoleFormPayload } from '../../interfaces/roles/role-form.interface';

const filter = ref('');
const showRoleDialog = ref(false);
const showDeleteDialog = ref(false);
const selectedRole = ref<RoleDetails | null>(null);
const roleToDelete = ref<RoleDetails | null>(null);
const route = useRoute();
const router = useRouter();

const {
  roles,
  permissions,
  loading,
  permissionsLoading,
  permissionsSavingId,
  saving,
  deletingId,
  error,
  rolesWithPermissions,
  loadRoles,
  loadPermissions,
  loadRole,
  saveRole,
  removeRole,
} = useRoles();

const {
  condominiums,
  loading: condominiumsLoading,
  loadCondominiums,
} = useCondominiums();

const columns: QTableColumn<RoleDetails>[] = [
  { name: 'name', label: 'Rol', field: 'displayName', align: 'left', sortable: true },
  { name: 'scope', label: 'Alcance', field: 'scope', align: 'left', sortable: true },
  { name: 'condominium', label: 'Condominio', field: 'condominiumName', align: 'left', sortable: true },
  { name: 'permissionsCount', label: 'Permisos', field: 'permissionsCount', align: 'left', sortable: true },
  { name: 'updatedAt', label: 'Actualizado', field: 'updatedAt', align: 'left', sortable: true },
  { name: 'actions', label: 'Acciones', field: 'id', align: 'right' },
];

const lastUpdatedLabel = computed(() => {
  if (!roles.value.length) {
    return 'Sin datos';
  }

  return roles.value[0]?.updatedAt || 'Sin datos';
});

const condominiumRoles = computed(() => roles.value.filter((role) => role.scope === 'condominium').length);
const systemRoles = computed(() => roles.value.filter((role) => role.scope !== 'condominium').length);

const stats = computed(() => [
  {
    label: 'Roles',
    value: String(roles.value.length),
    detail: `${rolesWithPermissions.value} con permisos`,
    icon: 'admin_panel_settings',
    tone: 'positive',
    color: 'primary',
  },
  {
    label: 'Condominio',
    value: String(condominiumRoles.value),
    detail: 'Roles con alcance local',
    icon: 'apartment',
    tone: 'neutral',
    color: 'secondary',
  },
  {
    label: 'Sistema',
    value: String(systemRoles.value),
    detail: 'Roles globales',
    icon: 'public',
    tone: 'neutral',
    color: 'accent',
  },
  {
    label: 'Actualizacion',
    value: lastUpdatedLabel.value,
    detail: 'Dato proveniente de la lista',
    icon: 'update',
    tone: 'neutral',
    color: 'primary',
  },
]);

const condominiumOptions = computed(() =>
  condominiums.value.map((condominium) => ({
    label: condominium.name,
    value: condominium.id,
  })),
);

function firstQueryValue(value: unknown) {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return typeof value === 'string' ? value : '';
}

const roleInitialScope = computed(() => {
  const scope = firstQueryValue(route.query.scope);
  return scope === 'condominium' ? 'condominium' : 'system';
});

const roleInitialCondominiumId = computed(() => {
  const condominiumId = firstQueryValue(route.query.condominiumId);
  return condominiumId || null;
});

const selectedCondominiumLabel = computed(() => {
  if (roleInitialScope.value !== 'condominium') {
    return '';
  }

  return firstQueryValue(route.query.condominiumName) || 'el condominio seleccionado';
});

const shouldOpenCreateDialog = computed(() => {
  const openCreate = firstQueryValue(route.query.openCreate).toLowerCase();
  return openCreate === '1' || openCreate === 'true';
});

function getInitials(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function scopeLabel(scope?: string) {
  if (!scope || scope === 'system') {
    return 'Sistema';
  }

  if (scope === 'condominium') {
    return 'Condominio';
  }

  return scope;
}

function scopeBadgeColor(scope?: string) {
  if (scope === 'condominium') {
    return 'secondary';
  }

  return 'primary';
}

function openCreateRole() {
  selectedRole.value = null;
  showDeleteDialog.value = false;
  showRoleDialog.value = true;
}

async function openEditRole(role: RoleDetails) {
  const fullRole = await loadRole(role.id);
  selectedRole.value = fullRole || role;
  showRoleDialog.value = true;
}

function openPermissions(role: RoleDetails) {
  const location = {
    path: `/admin/roles/${role.id}/permisos`,
    ...(role.scope === 'condominium' && role.condominiumId
      ? {
          query: {
            condominiumId: String(role.condominiumId),
            condominiumName: role.condominiumName || '',
          },
        }
      : {}),
  };

  void router.push(location);
}

function saveRoleHandler(payload: RoleFormPayload) {
  void (async () => {
    try {
      await saveRole(selectedRole.value?.id ?? null, payload);
      showRoleDialog.value = false;
      selectedRole.value = null;
    } catch {
      return;
    }
  })();
}

function confirmDelete(role: RoleDetails) {
  roleToDelete.value = role;
  showDeleteDialog.value = true;
}

function deleteSelectedRole() {
  if (!roleToDelete.value) {
    return;
  }

  void removeRole(roleToDelete.value.id);
  roleToDelete.value = null;
  showDeleteDialog.value = false;
}

const deleteDialogMessage = computed(() =>
  roleToDelete.value
    ? `¿Deseas eliminar ${roleToDelete.value.displayName}? Esta accion no se puede deshacer.`
    : '¿Deseas eliminar este rol? Esta accion no se puede deshacer.',
);

onMounted(() => {
  void loadRoles();
  void loadPermissions();
  void loadCondominiums();

  if (shouldOpenCreateDialog.value) {
    openCreateRole();
  }
});
</script>

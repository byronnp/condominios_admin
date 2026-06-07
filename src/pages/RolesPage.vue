<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Gestion de roles</p>
        <h1>Roles del sistema</h1>
        <p>Consulta, crea y actualiza los roles y sus permisos asignados.</p>
      </div>

      <div class="heading-actions">
        <q-btn outline color="primary" icon="refresh" label="Recargar" no-caps :disable="loading" @click="loadRoles" />
        <q-btn color="primary" icon="add_moderator" label="Nuevo rol" no-caps @click="openCreateRole" />
      </div>
    </section>

    <section class="metric-grid">
      <article class="metric-card metric-card--compact">
        <q-icon name="admin_panel_settings" class="metric-card__icon" />
        <span>Roles</span>
        <strong>{{ roles.length }}</strong>
        <small class="positive">Registrados en el sistema</small>
      </article>
      <article class="metric-card metric-card--compact">
        <q-icon name="verified_user" class="metric-card__icon" />
        <span>Con permisos</span>
        <strong>{{ rolesWithPermissions }}</strong>
        <small class="neutral">Tienen asignaciones activas</small>
      </article>
      <article class="metric-card metric-card--compact">
        <q-icon name="update" class="metric-card__icon" />
        <span>Actualizacion</span>
        <strong>{{ lastUpdatedLabel }}</strong>
        <small class="neutral">Dato proveniente de la lista</small>
      </article>
    </section>

    <section class="panel roles-info-panel">
      <div class="roles-info-panel__copy">
        <p class="eyebrow">Asignacion de permisos</p>
        <h2>Selecciona permisos desde el catalogo y ajusta el acceso por rol</h2>
        <p>
          Cada rol usa la misma lista global de permisos. Marca los accesos necesarios, guarda y el sistema
          mantendra la configuracion alineada con el backend.
        </p>
      </div>
      <div class="roles-info-panel__chips">
        <q-chip outline color="primary" icon="verified_user" :label="`${rolesWithPermissions} roles con permisos`" />
        <q-chip outline color="secondary" icon="list_alt" :label="`${permissions.length} permisos catalogados`" />
        <q-chip outline color="accent" icon="admin_panel_settings" label="Gestion centralizada" />
      </div>
    </section>

    <section class="panel data-panel">
      <div class="table-toolbar">
        <q-input
          v-model="filter"
          outlined
          dense
          debounce="250"
          placeholder="Buscar rol o guard"
          class="soft-input table-toolbar__search"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
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
                outline
                color="primary"
                icon="verified_user"
                label="Permisos"
                no-caps
                :loading="permissionsSavingId === props.row.id"
                :disable="permissionsLoading"
                @click="openPermissions(props.row)"
              />
              <q-btn outline color="primary" icon="edit" label="Editar" no-caps @click="openEditRole(props.row)" />
              <q-btn
                flat
                color="negative"
                icon="delete"
                label="Eliminar"
                no-caps
                :loading="deletingId === props.row.id"
                :disable="deletingId !== null && deletingId !== props.row.id"
                @click="confirmDelete(props.row)"
              />
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
                  <span>{{ props.row.guardName }}</span>
                </div>
              </div>
              <q-badge color="primary" :label="`${props.row.permissionsCount} permisos`" class="status-badge" />
            </div>

            <div class="condo-grid-card__details">
              <span>Nombre tecnico<strong>{{ props.row.name }}</strong></span>
              <span>Guard<strong>{{ props.row.guardName }}</strong></span>
              <span>Actualizado<strong>{{ props.row.updatedAt }}</strong></span>
            </div>

            <div class="row-actions row-actions--mobile">
              <q-btn
                outline
                color="primary"
                icon="verified_user"
                label="Permisos"
                no-caps
                :loading="permissionsSavingId === props.row.id"
                :disable="permissionsLoading"
                @click="openPermissions(props.row)"
              />
              <q-btn outline color="primary" icon="edit" label="Editar" no-caps @click="openEditRole(props.row)" />
              <q-btn
                flat
                color="negative"
                icon="delete"
                label="Eliminar"
                no-caps
                :loading="deletingId === props.row.id"
                :disable="deletingId !== null && deletingId !== props.row.id"
                @click="confirmDelete(props.row)"
              />
            </div>
          </div>
        </template>
      </q-table>
    </section>

      <RoleFormDialog
      v-model="showRoleDialog"
      :role="selectedRole"
      :saving="saving"
      @save="saveRoleHandler"
    />

      <RolePermissionsDialog
      v-model="showPermissionsDialog"
      :role="selectedRole"
      :permissions="permissions"
      :saving="permissionsSavingId === selectedRole?.id"
      @save="savePermissionsHandler"
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
    />  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { QTableColumn } from 'quasar';
import RoleFormDialog from 'components/dialogs/RoleFormDialog.vue';
import RolePermissionsDialog from 'components/dialogs/RolePermissionsDialog.vue';
import ConfirmDialog from 'components/general/ConfirmDialog.vue';
import { useRoles } from '../composables/useRoles';
import type { RoleDetails } from '../interfaces/roles/role.interface';

const filter = ref('');
const showRoleDialog = ref(false);
const showPermissionsDialog = ref(false);
const showDeleteDialog = ref(false);
const selectedRole = ref<RoleDetails | null>(null);
const roleToDelete = ref<RoleDetails | null>(null);

const {
  roles,
  permissions,
  loading,
  permissionsLoading,
  saving,
  deletingId,
  permissionsSavingId,
  error,
  rolesWithPermissions,
  loadRoles,
  loadPermissions,
  loadRole,
  saveRole,
  saveRolePermissions,
  removeRole,
} = useRoles();

const columns: QTableColumn<RoleDetails>[] = [
  { name: 'name', label: 'Rol', field: 'displayName', align: 'left', sortable: true },
  { name: 'guardName', label: 'Guard', field: 'guardName', align: 'left', sortable: true },
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

function getInitials(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function openCreateRole() {
  selectedRole.value = null;
  showRoleDialog.value = true;
}

async function openEditRole(role: RoleDetails) {
  showPermissionsDialog.value = false;
  const fullRole = await loadRole(role.id);
  selectedRole.value = fullRole || role;
  showRoleDialog.value = true;
}

async function openPermissions(role: RoleDetails) {
  showRoleDialog.value = false;
  if (permissions.value.length === 0 && !permissionsLoading.value) {
    await loadPermissions();
  }

  const fullRole = await loadRole(role.id);
  selectedRole.value = fullRole || role;
  showPermissionsDialog.value = true;
}

function saveRoleHandler(payload: { name: string }) {
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

function savePermissionsHandler(permissionIds: Array<number | string>) {
  if (!selectedRole.value) {
    return;
  }

  void (async () => {
    try {
      await saveRolePermissions(selectedRole.value!.id, permissionIds);
      showPermissionsDialog.value = false;
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
});
</script>


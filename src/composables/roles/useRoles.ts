import { computed, ref } from 'vue';
import type { RoleFormPayload } from '../../interfaces/roles/role-form.interface';
import type { PermissionDetails, RoleDetails, RoleResponse } from '../../interfaces/roles/role.interface';
import {
  createAdminRole,
  deleteAdminRole,
  getAdminPermissions,
  getAdminRoleById,
  getAdminRoles,
  normalizeRolePermissionIds,
  normalizeRolePermissions,
  updateAdminRole,
  updateAdminRolePermissions,
} from '../../services/roles/roles.service';

function normalizeRole(role: RoleResponse): RoleDetails {
  const name = role.display_name || role.name || 'Sin nombre';
  const permissions = normalizeRolePermissions(role.permissions);

  return {
    id: role.id ?? 0,
    name: role.name || name,
    displayName: name,
    guardName: role.guard_name || 'Sin guard',
    description: role.description || '',
    scope: (role as RoleResponse & { scope?: string }).scope || 'system',
    condominiumId:
      (role as RoleResponse & { condominium_id?: number | string | null }).condominium_id ?? null,
    condominiumName:
      (role as RoleResponse & { condominium_name?: string }).condominium_name || '',
    permissions,
    permissionIds: normalizeRolePermissionIds(role.permissions),
    permissionsCount: permissions.length,
    updatedAt: role.updated_at || 'Sin actualizar',
  };
}

export function useRoles() {
  const roles = ref<RoleDetails[]>([]);
  const permissions = ref<PermissionDetails[]>([]);
  const selectedRole = ref<RoleDetails | null>(null);
  const loading = ref(false);
  const permissionsLoading = ref(false);
  const loadingRoleId = ref<number | string | null>(null);
  const saving = ref(false);
  const deletingId = ref<number | string | null>(null);
  const permissionsSavingId = ref<number | string | null>(null);
  const error = ref('');

  const rolesWithPermissions = computed(() => roles.value.filter((role) => role.permissionsCount > 0).length);

  async function loadRoles() {
    loading.value = true;
    error.value = '';

    try {
      const response = await getAdminRoles();
      roles.value = response.map(normalizeRole);
    } catch (exception) {
      error.value = exception instanceof Error ? exception.message : 'No se pudieron cargar los roles';
      roles.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function loadPermissions() {
    permissionsLoading.value = true;
    error.value = '';

    try {
      const response = await getAdminPermissions();
      permissions.value = response;
    } catch (exception) {
      error.value = exception instanceof Error ? exception.message : 'No se pudieron cargar los permisos';
      permissions.value = [];
    } finally {
      permissionsLoading.value = false;
    }
  }

  async function loadRole(roleId: number | string) {
    loadingRoleId.value = roleId;

    try {
      const response = await getAdminRoleById(roleId);
      selectedRole.value = normalizeRole(response);
      return selectedRole.value;
    } catch (exception) {
      error.value = exception instanceof Error ? exception.message : 'No se pudo cargar el rol';
      selectedRole.value = null;
      return null;
    } finally {
      loadingRoleId.value = null;
    }
  }

  async function saveRole(roleId: number | string | null, payload: RoleFormPayload) {
    saving.value = true;
    error.value = '';

    try {
      if (roleId === null) {
        await createAdminRole(payload);
      } else {
        await updateAdminRole(roleId, payload);
      }

      await loadRoles();
    } catch (exception) {
      error.value = exception instanceof Error ? exception.message : 'No se pudo guardar el rol';
      throw exception;
    } finally {
      saving.value = false;
    }
  }

  async function saveRolePermissions(roleId: number | string, permissions: Array<number | string>) {
    permissionsSavingId.value = roleId;
    error.value = '';

    try {
      await updateAdminRolePermissions(roleId, { permissions });
      await loadRoles();
    } catch (exception) {
      error.value = exception instanceof Error ? exception.message : 'No se pudieron actualizar los permisos';
      throw exception;
    } finally {
      permissionsSavingId.value = null;
    }
  }

  async function removeRole(roleId: number | string) {
    deletingId.value = roleId;
    error.value = '';

    try {
      await deleteAdminRole(roleId);
      roles.value = roles.value.filter((role) => String(role.id) !== String(roleId));
    } catch (exception) {
      error.value = exception instanceof Error ? exception.message : 'No se pudo eliminar el rol';
    } finally {
      deletingId.value = null;
    }
  }

  return {
    roles,
    permissions,
    selectedRole,
    loading,
    permissionsLoading,
    loadingRoleId,
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
  };
}

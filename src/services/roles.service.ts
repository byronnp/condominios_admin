import type { RoleFormPayload, RolePermissionsPayload } from '../interfaces/roles/role-form.interface';
import type {
  PermissionResponse,
  PermissionDetails,
  PermissionsResponse,
  RoleResponse,
  RolesResponse,
} from '../interfaces/roles/role.interface';
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from './api.service';

function isRoleArray(value: unknown): value is RoleResponse[] {
  return Array.isArray(value);
}

function getRoleItems(response: unknown) {
  if (isRoleArray(response)) {
    return response;
  }

  const payload = response as RolesResponse;

  if (isRoleArray(payload.roles)) {
    return payload.roles;
  }

  if (isRoleArray(payload.items)) {
    return payload.items;
  }

  if (isRoleArray(payload.data)) {
    return payload.data;
  }

  if (isRoleArray(payload.data?.roles)) {
    return payload.data.roles;
  }

  if (isRoleArray(payload.data?.items)) {
    return payload.data.items;
  }

  if (isRoleArray(payload.data?.data)) {
    return payload.data.data;
  }

  return [];
}

function getRoleDetail(response: unknown) {
  if (response && typeof response === 'object' && !Array.isArray(response)) {
    const payload = response as {
      role?: RoleResponse;
      item?: RoleResponse;
      data?: RoleResponse | { role?: RoleResponse; item?: RoleResponse };
    };

    if (payload.role) {
      return payload.role;
    }

    if (payload.item) {
      return payload.item;
    }

    if (payload.data && !Array.isArray(payload.data)) {
      if ('role' in payload.data && payload.data.role) {
        return payload.data.role;
      }

      if ('item' in payload.data && payload.data.item) {
        return payload.data.item;
      }
    }

    if (payload.data && !Array.isArray(payload.data)) {
      return payload.data as RoleResponse;
    }
  }

  return response as RoleResponse;
}

function getPermissionNames(permissions: RoleResponse['permissions']) {
  if (!permissions) {
    return [];
  }

  if (Array.isArray(permissions)) {
    return permissions
      .map((permission) => {
        if (typeof permission === 'string') {
          return permission.trim();
        }

        return (
          permission.name ||
          permission.code ||
          permission.key ||
          permission.slug ||
          permission.id?.toString() ||
          ''
        ).trim();
      })
      .filter(Boolean);
  }

  return Object.entries(permissions)
    .filter(([, value]) => value !== false && value !== null && value !== undefined && value !== '')
    .map(([key, value]) => (typeof value === 'string' && value.trim() ? value.trim() : key.trim()))
    .filter(Boolean);
}

function getPermissionIds(permissions: RoleResponse['permissions']) {
  if (!permissions) {
    return [];
  }

  if (Array.isArray(permissions)) {
    return permissions
      .map((permission) => {
        if (typeof permission === 'string' || typeof permission === 'number') {
          return permission;
        }

        return permission.id ?? permission.code ?? permission.key ?? permission.slug ?? permission.name ?? '';
      })
      .filter((value) => value !== '');
  }

  return Object.entries(permissions)
    .filter(([, value]) => value !== false && value !== null && value !== undefined && value !== '')
    .map(([key, value]) => (typeof value === 'number' ? value : key))
    .filter((value) => value !== '');
}

function isPermissionArray(value: unknown): value is PermissionResponse[] {
  return Array.isArray(value);
}

function getPermissionItems(response: unknown) {
  if (isPermissionArray(response)) {
    return response;
  }

  const payload = response as PermissionsResponse;

  if (isPermissionArray(payload.permissions)) {
    return payload.permissions;
  }

  if (isPermissionArray(payload.items)) {
    return payload.items;
  }

  if (isPermissionArray(payload.data)) {
    return payload.data;
  }

  if (isPermissionArray(payload.data?.permissions)) {
    return payload.data.permissions;
  }

  if (isPermissionArray(payload.data?.items)) {
    return payload.data.items;
  }

  if (isPermissionArray(payload.data?.data)) {
    return payload.data.data;
  }

  return [];
}

function normalizePermissionName(permission: PermissionResponse) {
  return (
    permission.name ||
    permission.code ||
    permission.key ||
    permission.slug ||
    permission.id?.toString() ||
    'Sin nombre'
  );
}

function normalizePermissionParentId(permission: PermissionResponse) {
  const parentId = permission.parent_id ?? permission.parentId ?? null;

  if (parentId === null || parentId === undefined || parentId === '') {
    return null;
  }

  return parentId;
}

export async function getAdminRoles() {
  const response = await apiGet<unknown>('admin/roles');
  return getRoleItems(response);
}

export async function getAdminRoleById(roleId: number | string): Promise<RoleResponse> {
  const response = await apiGet<unknown>(`admin/roles/${roleId}`);
  return getRoleDetail(response);
}

export async function createAdminRole(payload: RoleFormPayload) {
  return apiPost<unknown, RoleFormPayload>('admin/roles', payload);
}

export async function updateAdminRole(roleId: number | string, payload: RoleFormPayload) {
  return apiPatch<unknown, RoleFormPayload>(`admin/roles/${roleId}`, payload);
}

export async function deleteAdminRole(roleId: number | string) {
  return apiDelete<unknown>(`admin/roles/${roleId}`);
}

export async function updateAdminRolePermissions(
  roleId: number | string,
  payload: RolePermissionsPayload,
) {
  return apiPut<unknown, RolePermissionsPayload>(`admin/roles/${roleId}/permissions`, payload);
}

export function normalizeRolePermissions(permissions: RoleResponse['permissions']) {
  return getPermissionNames(permissions);
}

export function normalizeRolePermissionIds(permissions: RoleResponse['permissions']) {
  return getPermissionIds(permissions);
}

export function normalizePermissionsList(response: unknown): PermissionDetails[] {
  return getPermissionItems(response).map((permission) => ({
    id: permission.id ?? permission.code ?? permission.key ?? permission.slug ?? permission.name ?? '',
    name: normalizePermissionName(permission),
    code: permission.code || permission.key || permission.slug || '',
    guardName: permission.guard_name || 'Sin guard',
    description: permission.description || '',
    parentId: normalizePermissionParentId(permission),
    children: [],
  }));
}

export async function getAdminPermissions(): Promise<PermissionDetails[]> {
  const response = await apiGet<unknown>('admin/permissions');
  return normalizePermissionsList(response);
}

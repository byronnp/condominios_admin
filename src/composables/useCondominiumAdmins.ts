import { ref } from 'vue';
import type {
  CondominiumAdmin,
  CondominiumAdminResponse,
} from '../interfaces/administrators/administrator.interface';
import {
  deleteCondominiumAdmin,
  getCondominiumAdmins,
} from '../services/condominiums.service';

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

function getStatusName(status: CondominiumAdminResponse['status']) {
  if (status && typeof status === 'object') {
    return status.name || String(status.id || 'Activo');
  }

  return status !== undefined && status !== null && status !== '' ? String(status) : 'Activo';
}

function normalizePermissionText(value: unknown) {
  if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
    return '';
  }

  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .toLowerCase()
    .trim();
}

function compactPermissionText(value: string) {
  return value.replace(/\s+/g, '');
}

function getPermissionTokens(permissions: CondominiumAdminResponse['permissions']) {
  if (!permissions) {
    return [];
  }

  if (Array.isArray(permissions)) {
    return permissions.flatMap((permission) => {
      if (typeof permission === 'string') {
        return [normalizePermissionText(permission)];
      }

      return [permission.key, permission.code, permission.slug, permission.name]
        .filter((value): value is string => Boolean(value))
        .map(normalizePermissionText);
    });
  }

  return Object.entries(permissions).flatMap(([key, value]) => {
    if (value === false || value === null || value === undefined || value === '') {
      return [];
    }

    return [key, value].map(normalizePermissionText);
  });
}

function hasPermission(
  admin: CondominiumAdminResponse,
  field: keyof Pick<
    CondominiumAdminResponse,
    | 'can_manage_houses'
    | 'can_manage_residents'
    | 'can_manage_fees'
    | 'can_manage_payments'
    | 'can_manage_invitations'
  >,
  aliases: string[],
) {
  if (admin[field] === true) {
    return true;
  }

  const normalizedAliases = aliases.map(normalizePermissionText);
  const tokens = getPermissionTokens(admin.permissions);
  const compactAliases = normalizedAliases.map(compactPermissionText);

  return tokens.some((token) => {
    const compactToken = compactPermissionText(token);

    return (
      normalizedAliases.includes(token) ||
      compactAliases.includes(compactToken) ||
      normalizedAliases.some((alias) => token.includes(alias) || alias.includes(token)) ||
      compactAliases.some((alias) => compactToken.includes(alias) || alias.includes(compactToken))
    );
  });
}

function getPermissionFlags(admin: CondominiumAdminResponse) {
  const hasPermissionData =
    admin.can_manage_houses !== undefined ||
    admin.can_manage_residents !== undefined ||
    admin.can_manage_fees !== undefined ||
    admin.can_manage_payments !== undefined ||
    admin.can_manage_invitations !== undefined ||
    admin.permissions !== undefined;

  return {
    hasPermissionData,
    canManageHouses: hasPermission(admin, 'can_manage_houses', [
      'can_manage_houses',
      'manage_houses',
      'houses',
      'casas',
      'gestionar casas',
      'gestion casas',
      'gestion de casas',
      'administrar casas',
      'viviendas',
      'gestionar viviendas',
    ]),
    canManageResidents: hasPermission(admin, 'can_manage_residents', [
      'can_manage_residents',
      'manage_residents',
      'residents',
      'residentes',
      'gestionar residentes',
      'gestion residentes',
      'gestion de residentes',
      'administrar residentes',
    ]),
    canManageFees: hasPermission(admin, 'can_manage_fees', [
      'can_manage_fees',
      'manage_fees',
      'fees',
      'alicuotas',
      'gestionar alicuotas',
      'gestion alicuotas',
      'gestion de alicuotas',
      'administrar alicuotas',
      'cuotas',
      'gestionar cuotas',
    ]),
    canManagePayments: hasPermission(admin, 'can_manage_payments', [
      'can_manage_payments',
      'manage_payments',
      'payments',
      'pagos',
      'gestionar pagos',
      'gestion pagos',
      'gestion de pagos',
      'administrar pagos',
    ]),
    canManageInvitations: hasPermission(admin, 'can_manage_invitations', [
      'can_manage_invitations',
      'manage_invitations',
      'invitations',
      'invitaciones',
      'gestionar invitaciones',
      'gestion invitaciones',
      'gestion de invitaciones',
      'administrar invitaciones',
    ]),
  };
}

function normalizePermissions(flags: ReturnType<typeof getPermissionFlags>) {
  return [
    flags.canManageHouses ? 'Casas' : '',
    flags.canManageResidents ? 'Residentes' : '',
    flags.canManageFees ? 'Alicuotas' : '',
    flags.canManagePayments ? 'Pagos' : '',
    flags.canManageInvitations ? 'Invitaciones' : '',
  ].filter(Boolean);
}

function normalizeIdentificationTypeId(admin: CondominiumAdminResponse) {
  const value = admin.identification_type?.id ?? admin.identification_type_id;

  if (value === undefined || value === null || value === '') {
    return null;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : value;
}

function normalizeAdmin(admin: CondominiumAdminResponse): CondominiumAdmin {
  const fullName = [admin.first_name, admin.last_name].filter(Boolean).join(' ');
  const name = fullName || admin.name || 'Sin nombre';
  const fallbackNameParts = name === 'Sin nombre' ? [] : name.split(' ').filter(Boolean);
  const permissionFlags = getPermissionFlags(admin);

  return {
    id: toNumber(admin.id),
    firstName: admin.first_name || fallbackNameParts[0] || '',
    lastName: admin.last_name || fallbackNameParts.slice(1).join(' '),
    initials: getInitials(name) || 'AD',
    name,
    email: admin.email || 'Sin correo',
    identificationTypeId: normalizeIdentificationTypeId(admin),
    phone: admin.mobile_phone || admin.phone || 'Sin telefono',
    landlinePhone: admin.landline_phone || '',
    identificationNumber: admin.identification_number || 'Sin identificacion',
    canManageHouses: permissionFlags.canManageHouses,
    canManageResidents: permissionFlags.canManageResidents,
    canManageFees: permissionFlags.canManageFees,
    canManagePayments: permissionFlags.canManagePayments,
    canManageInvitations: permissionFlags.canManageInvitations,
    hasPermissionData: permissionFlags.hasPermissionData,
    permissions: normalizePermissions(permissionFlags),
    status: getStatusName(admin.status),
  };
}

export function useCondominiumAdmins() {
  const admins = ref<CondominiumAdmin[]>([]);
  const loading = ref(false);
  const deletingId = ref<number | null>(null);
  const error = ref('');

  async function loadAdmins(condominiumId: number | string) {
    loading.value = true;
    error.value = '';

    try {
      const response = await getCondominiumAdmins(condominiumId);
      admins.value = response.map(normalizeAdmin);
    } catch (exception) {
      error.value = exception instanceof Error ? exception.message : 'No se pudieron cargar los administradores';
      admins.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function removeAdmin(condominiumId: number | string, adminId: number) {
    deletingId.value = adminId;
    error.value = '';

    try {
      await deleteCondominiumAdmin(condominiumId, adminId);
      admins.value = admins.value.filter((admin) => admin.id !== adminId);
    } catch (exception) {
      error.value = exception instanceof Error ? exception.message : 'No se pudo eliminar el administrador';
    } finally {
      deletingId.value = null;
    }
  }

  return {
    admins,
    loading,
    deletingId,
    error,
    loadAdmins,
    removeAdmin,
  };
}

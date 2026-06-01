import type {
  CreateCondominiumAdminPayload,
  UpdateCondominiumAdminPayload,
} from '../interfaces/administrators/administrator-form.interface';
import type { CreateCondominiumPayload } from '../interfaces/create-condominium/condominium-form.interface';
import type { UpdateCondominiumPayload } from '../interfaces/edit-condominium/condominium-form.interface';
import type {
  CondominiumAdminResponse,
  CondominiumAdminsResponse,
} from '../interfaces/administrators/administrator.interface';
import type {
  AdminCondominiumResponse,
  AdminCondominiumsResponse,
} from '../interfaces/condominiums/condominium.interface';
import { apiDelete, apiGet, apiPatch, apiPost } from './api.service';

function isAdminCondominiumArray(value: unknown): value is AdminCondominiumResponse[] {
  return Array.isArray(value);
}

function isCondominiumAdminArray(value: unknown): value is CondominiumAdminResponse[] {
  return Array.isArray(value);
}

function getCondominiumItems(response: unknown) {
  if (isAdminCondominiumArray(response)) {
    return response;
  }

  const payload = response as AdminCondominiumsResponse;

  if (isAdminCondominiumArray(payload.items)) {
    return payload.items;
  }

  if (isAdminCondominiumArray(payload.condominiums)) {
    return payload.condominiums;
  }

  if (isAdminCondominiumArray(payload.data)) {
    return payload.data;
  }

  if (isAdminCondominiumArray(payload.data?.items)) {
    return payload.data.items;
  }

  if (isAdminCondominiumArray(payload.data?.condominiums)) {
    return payload.data.condominiums;
  }

  if (isAdminCondominiumArray(payload.data?.data)) {
    return payload.data.data;
  }

  return [];
}

function getCondominiumAdminItems(response: unknown) {
  if (isCondominiumAdminArray(response)) {
    return response;
  }

  const payload = response as CondominiumAdminsResponse;

  if (isCondominiumAdminArray(payload.items)) {
    return payload.items;
  }

  if (isCondominiumAdminArray(payload.admins)) {
    return payload.admins;
  }

  if (isCondominiumAdminArray(payload.data)) {
    return payload.data;
  }

  if (isCondominiumAdminArray(payload.data?.items)) {
    return payload.data.items;
  }

  if (isCondominiumAdminArray(payload.data?.admins)) {
    return payload.data.admins;
  }

  if (isCondominiumAdminArray(payload.data?.data)) {
    return payload.data.data;
  }

  return [];
}

export async function getAdminCondominiums() {
  const response = await apiGet<unknown>('admin/condominiums');
  return getCondominiumItems(response);
}

export async function createAdminCondominium(payload: CreateCondominiumPayload) {
  return apiPost<unknown, CreateCondominiumPayload>('admin/condominiums', payload);
}

export async function deleteAdminCondominium(condominiumId: number | string) {
  return apiDelete<unknown>(`admin/condominiums/${condominiumId}`);
}

export async function updateAdminCondominium(
  condominiumId: number | string,
  payload: UpdateCondominiumPayload,
) {
  return apiPatch<unknown, UpdateCondominiumPayload>(`admin/condominiums/${condominiumId}`, payload);
}

export async function getAdminCondominiumById(id: string) {
  const condominiums = await getAdminCondominiums();
  return condominiums.find((condominium) => String(condominium.id) === id) || null;
}

export async function createCondominiumAdmin(
  condominiumId: number | string,
  payload: CreateCondominiumAdminPayload,
) {
  return apiPost<unknown, CreateCondominiumAdminPayload>(
    `admin/condominiums/${condominiumId}/admins`,
    payload,
  );
}

export async function getCondominiumAdmins(condominiumId: number | string) {
  const response = await apiGet<unknown>(`admin/condominiums/${condominiumId}/admins`);
  return getCondominiumAdminItems(response);
}

export async function getCondominiumAdminById(condominiumId: number | string, adminId: number | string) {
  const admins = await getCondominiumAdmins(condominiumId);
  return admins.find((admin) => String(admin.id) === String(adminId)) || null;
}

export async function updateCondominiumAdmin(
  condominiumId: number | string,
  adminId: number | string,
  payload: UpdateCondominiumAdminPayload,
) {
  return apiPatch<unknown, UpdateCondominiumAdminPayload>(
    `admin/condominiums/${condominiumId}/admins/${adminId}`,
    payload,
  );
}

export async function deleteCondominiumAdmin(condominiumId: number | string, adminId: number | string) {
  return apiDelete<unknown>(`admin/condominiums/${condominiumId}/admins/${adminId}`);
}

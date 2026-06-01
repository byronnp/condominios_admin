import type {
  CreateHousePayload,
  UpdateHousePayload,
} from '../interfaces/houses/house-form.interface';
import type { HouseResponse, HousesResponse } from '../interfaces/houses/house.interface';
import { apiGet, apiPost, apiPut } from './api.service';

function isHouseArray(value: unknown): value is HouseResponse[] {
  return Array.isArray(value);
}

function getHouseItems(response: unknown) {
  if (isHouseArray(response)) {
    return response;
  }

  const payload = response as HousesResponse;

  if (isHouseArray(payload.items)) {
    return payload.items;
  }

  if (isHouseArray(payload.houses)) {
    return payload.houses;
  }

  if (isHouseArray(payload.data)) {
    return payload.data;
  }

  if (isHouseArray(payload.data?.data)) {
    return payload.data.data;
  }

  return [];
}

export async function getAdminHouses(condominiumId?: number | string) {
  const query = condominiumId ? `?condominium_id=${encodeURIComponent(String(condominiumId))}` : '';
  const response = await apiGet<unknown>(`admin/houses${query}`);
  return getHouseItems(response);
}

export function createAdminHouse(payload: CreateHousePayload) {
  return apiPost<unknown, CreateHousePayload>('admin/houses', payload);
}

export function updateAdminHouse(houseId: number | string, payload: UpdateHousePayload) {
  return apiPut<unknown, UpdateHousePayload>(`admin/houses/${houseId}`, payload);
}

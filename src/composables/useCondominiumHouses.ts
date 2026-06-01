import { ref } from 'vue';
import type { House, HouseResponse } from '../interfaces/houses/house.interface';
import { getAdminHouses } from '../services/houses.service';

function toNumber(value: number | string | undefined, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getCondominiumId(value: HouseResponse['condominium_id']) {
  if (value && typeof value === 'object') {
    return toNumber(value.id);
  }

  return toNumber(value);
}

function getCondominiumName(value: HouseResponse['condominium_id']) {
  if (value && typeof value === 'object') {
    return value.name || 'Sin condominio';
  }

  return 'Sin condominio';
}

function getStatusColor(status: string) {
  const normalizedStatus = status
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  if (normalizedStatus.includes('inactive') || normalizedStatus.includes('inactivo')) {
    return 'negative';
  }

  if (normalizedStatus.includes('pending') || normalizedStatus.includes('pendiente')) {
    return 'warning';
  }

  if (normalizedStatus.includes('active') || normalizedStatus.includes('activo')) {
    return 'positive';
  }

  return 'grey';
}

function normalizeHouse(house: HouseResponse): House {
  const status = house.status || 'active';

  return {
    id: toNumber(house.id),
    condominiumId: getCondominiumId(house.condominium_id),
    condominiumName: getCondominiumName(house.condominium_id),
    code: house.code || '-',
    houseNumber: house.house_number || 'Sin numero',
    addressReference: house.address_reference || 'Sin referencia',
    status,
    statusColor: getStatusColor(status),
  };
}

export function useCondominiumHouses() {
  const houses = ref<House[]>([]);
  const loading = ref(false);
  const error = ref('');

  async function loadHouses(condominiumId: number | string) {
    loading.value = true;
    error.value = '';

    try {
      const response = await getAdminHouses(condominiumId);
      const id = Number(condominiumId);
      houses.value = response.map(normalizeHouse).filter((house) => house.condominiumId === id);
    } catch (exception) {
      error.value = exception instanceof Error ? exception.message : 'No se pudieron cargar las casas';
      houses.value = [];
    } finally {
      loading.value = false;
    }
  }

  return {
    houses,
    loading,
    error,
    loadHouses,
  };
}

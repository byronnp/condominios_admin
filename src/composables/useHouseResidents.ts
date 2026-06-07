import { ref } from 'vue';
import { getHouseResidents } from '../services/houses.service';
import type { HouseOwnerOption, HouseResidentResponse } from '../interfaces/houses/house-owner.interface';

function toNumber(value: number | string | undefined, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getInitials(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function getName(resident: HouseResidentResponse) {
  return (
    resident.name ||
    [resident.first_name, resident.last_name].filter(Boolean).join(' ') ||
    'Sin nombre'
  );
}

function getRole(resident: HouseResidentResponse) {
  if (resident.role && typeof resident.role === 'object') {
    return resident.role.name || String(resident.role.id || 'Residente');
  }

  return resident.role ? String(resident.role) : 'Residente';
}

function getStatus(resident: HouseResidentResponse) {
  if (resident.status && typeof resident.status === 'object') {
    return resident.status.name || String(resident.status.id || 'Activo');
  }

  return resident.status ? String(resident.status) : 'Activo';
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

function getPropertyLabel(resident: HouseResidentResponse) {
  if (resident.property_label) {
    return resident.property_label;
  }

  const pieces = [resident.code, resident.house_number].filter(Boolean);

  if (pieces.length > 0) {
    return `Casa ${pieces.join(' · ')}`;
  }

  return 'Sin vivienda';
}

function normalizeResident(resident: HouseResidentResponse): HouseOwnerOption {
  const name = getName(resident);
  const initials = resident.initials || getInitials(name) || 'RE';
  const status = getStatus(resident);

  return {
    id: toNumber(resident.id),
    initials,
    name,
    email: resident.email || 'Sin correo',
    role: getRole(resident),
    status,
    statusColor: getStatusColor(status),
    propertyLabel: getPropertyLabel(resident),
  };
}

export function useHouseResidents() {
  const residents = ref<HouseOwnerOption[]>([]);
  const loading = ref(false);
  const error = ref('');

  async function loadResidents(houseId: number | string) {
    loading.value = true;
    error.value = '';

    try {
      const response = await getHouseResidents(houseId);
      residents.value = response.map(normalizeResident);
    } catch (exception) {
      error.value = exception instanceof Error ? exception.message : 'No se pudieron cargar los residentes';
      residents.value = [];
    } finally {
      loading.value = false;
    }
  }

  return {
    residents,
    loading,
    error,
    loadResidents,
  };
}

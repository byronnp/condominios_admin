import { ref } from 'vue';
import type {
  AdminCondominiumResponse,
  CondominiumDetails,
} from '../../interfaces/condominiums/condominium.interface';
import { deleteAdminCondominium, getAdminCondominiums } from '../../services/condominiums/condominiums.service';

function toNumber(value: number | string | undefined, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toCurrency(value: number | string | undefined) {
  if (value === undefined || value === null || value === '') {
    return '$0';
  }

  if (typeof value === 'number') {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  }

  return value;
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
    return status.name || String(status.id || 'Pendiente');
  }

  return status !== undefined && status !== null && status !== '' ? String(status) : 'Pendiente';
}

function getStatusColor(status: string) {
  const normalizedStatus = status
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  if (normalizedStatus.includes('inactivo') || normalizedStatus.includes('inactive')) {
    return 'negative';
  }

  if (normalizedStatus.includes('revision') || normalizedStatus.includes('review')) {
    return 'orange';
  }

  if (normalizedStatus.includes('pendiente') || normalizedStatus.includes('pending')) {
    return 'warning';
  }

  if (normalizedStatus.includes('activo') || normalizedStatus.includes('active')) {
    return 'positive';
  }

  return 'grey';
}

function normalizeCondominium(condominium: AdminCondominiumResponse): CondominiumDetails {
  const name = condominium.name || 'Sin nombre';
  const status = getStatusName(condominium.status);

  return {
    id: toNumber(condominium.id),
    initials: getInitials(name) || 'CN',
    name,
    address: condominium.address || 'Sin direccion registrada',
    city: condominium.city || 'Sin ciudad',
    administrator:
      condominium.administrator_name ||
      condominium.administrator ||
      condominium.admin_name ||
      'Pendiente',
    units: toNumber(
      condominium.total_houses ??
        condominium.total_homes ??
        condominium.total_casas ??
        condominium.houses_count ??
        condominium.units ??
        condominium.total_units,
    ),
    occupancy: toNumber(condominium.occupancy_percentage ?? condominium.occupancy),
    revenue: toCurrency(condominium.revenue ?? condominium.monthly_revenue),
    status,
    statusColor: getStatusColor(status),
    updatedAt: condominium.updatedAt || condominium.updated_at || 'Sin actualizar',
  };
}

export function useCondominiums() {
  const condominiums = ref<CondominiumDetails[]>([]);
  const loading = ref(false);
  const deletingId = ref<number | null>(null);
  const error = ref('');

  async function loadCondominiums() {
    loading.value = true;
    error.value = '';

    try {
      const response = await getAdminCondominiums();
      condominiums.value = response.map(normalizeCondominium);
    } catch (exception) {
      error.value = exception instanceof Error ? exception.message : 'No se pudieron cargar los condominios';
      condominiums.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function removeCondominium(condominiumId: number) {
    deletingId.value = condominiumId;
    error.value = '';

    try {
      await deleteAdminCondominium(condominiumId);
      condominiums.value = condominiums.value.filter((condominium) => condominium.id !== condominiumId);
    } catch (exception) {
      error.value = exception instanceof Error ? exception.message : 'No se pudo eliminar el condominio';
    } finally {
      deletingId.value = null;
    }
  }

  return {
    condominiums,
    loading,
    deletingId,
    error,
    loadCondominiums,
    removeCondominium,
  };
}

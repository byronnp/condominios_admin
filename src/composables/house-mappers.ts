import type { House, HouseResponse } from '../interfaces/houses/house.interface';

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

function getInitials(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function getOwnerValue(house: HouseResponse) {
  if (house.owner && typeof house.owner === 'object') {
    return house.owner;
  }

  return null;
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

export function normalizeHouse(house: HouseResponse): House {
  const status = house.status || 'active';
  const owner = getOwnerValue(house);
  const ownerId = owner?.id !== undefined ? toNumber(owner.id, 0) : null;
  const ownerName = owner?.name || '';
  const ownerEmail = owner?.email || '';
  const ownerPhone = owner?.phone || '';
  const hasOwner = Boolean(ownerName || ownerId);

  return {
    id: toNumber(house.id),
    condominiumId: getCondominiumId(house.condominium_id),
    condominiumName: getCondominiumName(house.condominium_id),
    code: house.code || '-',
    houseNumber: house.house_number || 'Sin numero',
    addressReference: house.address_reference || 'Sin referencia',
    status,
    statusColor: getStatusColor(status),
    ownerId: hasOwner ? ownerId : null,
    ownerName: hasOwner ? ownerName || 'Sin dueño' : 'Sin dueño',
    ownerEmail: hasOwner ? ownerEmail || 'Sin correo' : 'Sin correo',
    ownerPhone: hasOwner ? ownerPhone || 'Sin teléfono' : 'Sin teléfono',
    ownerInitials: hasOwner ? getInitials(ownerName) || 'DU' : 'DU',
    hasOwner,
    actions: {
      edit: house.actions?.edit ?? false,
      assign_resident: house.actions?.assign_resident ?? false,
      manage_fees: house.actions?.manage_fees ?? false,
      view_payments: house.actions?.view_payments ?? false,
      register_payment: house.actions?.register_payment ?? false,
      view_balance: house.actions?.view_balance ?? false,
      advance_payment: house.actions?.advance_payment ?? false,
      invite_user: house.actions?.invite_user ?? false,
    },
  };
}

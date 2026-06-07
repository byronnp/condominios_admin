import type { HouseOwnerOption } from '../interfaces/houses/house-owner.interface';

export const houseOwnerOptions: HouseOwnerOption[] = [
  {
    id: 1,
    initials: 'DP',
    name: 'Daniel Perez',
    email: 'daniel@email.com',
    role: 'Propietario',
    status: 'Activo',
    statusColor: 'positive',
    propertyLabel: 'Casa B-14',
  },
  {
    id: 2,
    initials: 'LC',
    name: 'Lucia Castro',
    email: 'lucia@email.com',
    role: 'Propietaria',
    status: 'Activo',
    statusColor: 'positive',
    propertyLabel: 'Casa C-02',
  },
  {
    id: 3,
    initials: 'RM',
    name: 'Rafael Mora',
    email: 'rafael@email.com',
    role: 'Residente',
    status: 'Pendiente',
    statusColor: 'warning',
    propertyLabel: 'Casa A-07',
  },
  {
    id: 4,
    initials: 'AV',
    name: 'Ana Vera',
    email: 'ana@email.com',
    role: 'Propietaria',
    status: 'Activo',
    statusColor: 'positive',
    propertyLabel: 'Casa C-11',
  },
];

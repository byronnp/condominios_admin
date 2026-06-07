export interface ResidentHouseRef {
  id: number;
  code: string;
  condominium: string;
}

export interface ResidentDetails {
  id: number;
  initials: string;
  name: string;
  email: string;
  identificationType: string;
  identificationNumber: string;
  phone: string;
  condominium: string;
  house: string;
  relationship: string;
  role: string;
  status: string;
  statusColor: string;
  lastActivity: string;
}

export interface ResidentFormData {
  firstName: string;
  lastName: string;
  identificationType: string;
  identificationNumber: string;
  email: string;
  mobilePhone: string;
  landlinePhone: string;
  condominium: string;
  house: string;
  relationship: string;
  role: string;
  status: string;
  receiveNotifications: boolean;
}

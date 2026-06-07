export interface ResidentForm {
  firstName: string;
  lastName: string;
  identificationTypeId: number | string | null;
  identificationNumber: string;
  mobilePhone: string;
  landlinePhone: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  houseId: number | string | null;
  relationshipTypeId: number | string | null;
  isPrimary: boolean;
  canReceiveNotifications: boolean;
}

export interface CreateResidentPayload {
  first_name: string;
  last_name: string;
  identification_type_id: number | string;
  identification_number: string;
  mobile_phone?: string | null;
  landline_phone?: string | null;
  email: string;
  password?: string | null;
  password_confirmation?: string | null;
  house_id: number | string;
  relationship_type_id: number | string;
  role_id?: number | string;
  is_primary?: boolean;
  can_receive_notifications?: boolean;
}

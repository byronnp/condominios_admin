export interface AdministratorForm {
  name: string;
  email: string;
  phone: string;
  condominium: string;
  city: string;
  status: string;
  permissions: string;
}

export interface CreateCondominiumAdminPayload {
  first_name: string;
  last_name: string;
  identification_type_id: number;
  identification_number: string;
  mobile_phone: string;
  landline_phone: string;
  email: string;
  password: string;
  password_confirmation: string;
  can_manage_houses: boolean;
  can_manage_residents: boolean;
  can_manage_fees: boolean;
  can_manage_payments: boolean;
  can_manage_invitations: boolean;
}

export interface UpdateCondominiumAdminPayload {
  first_name: string;
  last_name: string;
  identification_type_id: number;
  identification_number: string;
  mobile_phone: string;
  landline_phone: string;
  email: string;
  can_manage_houses: boolean;
  can_manage_residents: boolean;
  can_manage_fees: boolean;
  can_manage_payments: boolean;
  can_manage_invitations: boolean;
  password?: string;
  password_confirmation?: string;
}

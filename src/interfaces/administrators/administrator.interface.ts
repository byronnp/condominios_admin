export interface AdministratorDetails {
  id: number;
  initials: string;
  name: string;
  email: string;
  phone: string;
  condominium: string;
  city: string;
  status: string;
  statusColor: string;
  lastAccess: string;
  managedUnits: number;
}

export interface CondominiumAdminResponse {
  id?: number | string;
  first_name?: string;
  last_name?: string;
  name?: string;
  email?: string;
  identification_type_id?: number | string;
  identification_type?: {
    id?: number | string;
    name?: string;
  };
  mobile_phone?: string;
  landline_phone?: string;
  phone?: string;
  identification_number?: string;
  can_manage_houses?: boolean;
  can_manage_residents?: boolean;
  can_manage_fees?: boolean;
  can_manage_payments?: boolean;
  can_manage_invitations?: boolean;
  permissions?:
    | Array<
        | string
        | {
            id?: number | string;
            name?: string;
            code?: string;
            key?: string;
            slug?: string;
          }
      >
    | Record<string, boolean | string | number | null | undefined>;
  status?: string | number | { id?: string | number; name?: string };
}

export interface CondominiumAdmin {
  id: number;
  firstName: string;
  lastName: string;
  initials: string;
  name: string;
  email: string;
  identificationTypeId: number | string | null;
  phone: string;
  landlinePhone: string;
  identificationNumber: string;
  canManageHouses: boolean;
  canManageResidents: boolean;
  canManageFees: boolean;
  canManagePayments: boolean;
  canManageInvitations: boolean;
  hasPermissionData: boolean;
  permissions: string[];
  status: string;
}

export interface CondominiumAdminsResponse {
  success?: boolean;
  message?: string;
  admins?: CondominiumAdminResponse[];
  items?: CondominiumAdminResponse[];
  data?:
    | CondominiumAdminResponse[]
    | {
        admins?: CondominiumAdminResponse[];
        items?: CondominiumAdminResponse[];
        data?: CondominiumAdminResponse[];
      };
}

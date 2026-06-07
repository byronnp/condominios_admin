export interface HouseCondominiumRef {
  id?: number | string;
  name?: string;
}

export interface HouseOwnerRef {
  id?: number | string;
  name?: string;
  email?: string;
  phone?: string;
  initials?: string;
}

export interface HouseActions {
  edit?: boolean;
  assign_resident?: boolean;
  manage_fees?: boolean;
  view_payments?: boolean;
  register_payment?: boolean;
  view_balance?: boolean;
  advance_payment?: boolean;
  invite_user?: boolean;
}

export interface HouseResponse {
  id?: number | string;
  condominium_id?: number | string | HouseCondominiumRef;
  code?: string;
  house_number?: string | null;
  address_reference?: string | null;
  status?: string;
  owner?: HouseOwnerRef | null;
  administrator?: HouseOwnerRef | null;
  actions?: HouseActions;
}

export interface House {
  id: number;
  condominiumId: number;
  condominiumName: string;
  code: string;
  houseNumber: string;
  addressReference: string;
  status: string;
  statusColor: string;
  ownerId: number | null;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerInitials: string;
  hasOwner: boolean;
  actions: HouseActions;
}

export interface HousesResponse {
  success?: boolean;
  message?: string;
  data?:
    | HouseResponse[]
    | {
        data?: HouseResponse[];
      };
  items?: HouseResponse[];
  houses?: HouseResponse[];
  meta?: {
    current_page?: number | string;
    last_page?: number | string;
    per_page?: number | string;
    total?: number | string;
  };
}

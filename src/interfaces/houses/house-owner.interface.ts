export interface HouseOwnerOption {
  id: number;
  initials: string;
  name: string;
  email: string;
  role: string;
  status: string;
  statusColor: string;
  propertyLabel: string;
}

export interface HouseResidentResponse {
  id?: number | string;
  name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  mobile_phone?: string;
  initials?: string;
  status?: string | { id?: number | string; name?: string };
  role?: string | { id?: number | string; name?: string };
  property_label?: string;
  house_number?: string | null;
  code?: string;
  is_owner?: boolean;
  owner?: boolean;
}

export interface HouseResidentsResponse {
  success?: boolean;
  message?: string;
  items?: HouseResidentResponse[];
  residents?: HouseResidentResponse[];
  data?:
    | HouseResidentResponse[]
    | {
        items?: HouseResidentResponse[];
        residents?: HouseResidentResponse[];
        data?: HouseResidentResponse[];
      };
}

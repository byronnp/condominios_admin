export interface CondominiumDetails {
  id: number;
  initials: string;
  name: string;
  address: string;
  city: string;
  administrator: string;
  units: number;
  occupancy: number;
  revenue: string;
  status: string;
  statusColor: string;
  updatedAt: string;
}

export interface AdminCondominiumResponse {
  id?: number | string;
  name?: string;
  ruc?: string;
  address?: string;
  city?: string;
  sector?: string;
  administrator?: string;
  admin_name?: string;
  administrator_name?: string;
  admin_email?: string;
  administrator_email?: string;
  admin_phone?: string;
  administrator_phone?: string;
  plan?: string;
  total_houses?: number | string;
  total_homes?: number | string;
  total_casas?: number | string;
  houses_count?: number | string;
  units?: number | string;
  total_units?: number | string;
  occupancy?: number | string;
  occupancy_percentage?: number | string;
  revenue?: number | string;
  monthly_revenue?: number | string;
  status?: string | number | { id?: string | number; name?: string };
  updated_at?: string;
  updatedAt?: string;
}

export interface AdminCondominiumsResponse {
  success?: boolean;
  message?: string;
  items?: AdminCondominiumResponse[];
  condominiums?: AdminCondominiumResponse[];
  data?:
    | AdminCondominiumResponse[]
    | {
        condominiums?: AdminCondominiumResponse[];
        items?: AdminCondominiumResponse[];
        data?: AdminCondominiumResponse[];
      };
}

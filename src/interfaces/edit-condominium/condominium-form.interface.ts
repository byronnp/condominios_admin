export interface EditCondominiumForm {
  name: string;
  ruc: string;
  city: string;
  sector: string;
  address: string;
  units: number;
  status: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  plan: string;
}

export interface UpdateCondominiumPayload {
  name: string;
  ruc: string;
  address: string;
  city: string;
  sector: string;
  status_id: number;
  total_houses: number;
}

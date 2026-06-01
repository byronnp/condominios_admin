export interface CreateCondominiumForm {
  name: string;
  ruc: string;
  city: string;
  sector: string;
  address: string;
  statusId: number | string | null;
  totalHouses: number | null;
}

export interface CreateCondominiumPayload {
  name: string;
  ruc: string;
  address: string;
  city: string;
  sector: string;
  status_id: number;
  total_houses: number;
}

export interface HouseCondominiumRef {
  id?: number | string;
  name?: string;
}

export interface HouseResponse {
  id?: number | string;
  condominium_id?: number | string | HouseCondominiumRef;
  code?: string;
  house_number?: string | null;
  address_reference?: string | null;
  status?: string;
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

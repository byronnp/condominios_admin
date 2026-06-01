export interface HouseForm {
  houseNumber: string;
  addressReference: string;
  status: string;
}

export interface CreateHousePayload {
  condominium_id: number;
  house_number: string;
  address_reference?: string | null;
  status?: string;
}

export interface UpdateHousePayload {
  house_number?: string;
  address_reference?: string | null;
  status?: string;
}

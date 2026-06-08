export interface RoleFormPayload {
  name: string;
  scope?: string;
  condominium_id?: number | string | null;
  description?: string;
}

export interface RolePermissionsPayload {
  permissions: Array<number | string>;
}

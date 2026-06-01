export interface RoleFormPayload {
  name: string;
}

export interface RolePermissionsPayload {
  permissions: Array<number | string>;
}

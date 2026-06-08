export interface RolePermissionResponse {
  id?: number | string;
  name?: string;
  code?: string;
  key?: string;
  slug?: string;
}

export interface PermissionResponse {
  id?: number | string;
  name?: string;
  code?: string;
  key?: string;
  slug?: string;
  group?: string;
  scope?: string;
  parent_id?: number | string | null;
  parentId?: number | string | null;
  description?: string | null;
  guard_name?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  children?: PermissionResponse[] | null;
}

export interface RoleResponse {
  id?: number | string;
  name?: string;
  display_name?: string;
  guard_name?: string;
  description?: string | null;
  permissions?:
    | Array<string | RolePermissionResponse>
    | Record<string, boolean | string | number | null | undefined>;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface RolesResponse {
  success?: boolean;
  message?: string;
  roles?: RoleResponse[];
  items?: RoleResponse[];
  data?:
    | RoleResponse[]
    | {
        roles?: RoleResponse[];
        items?: RoleResponse[];
        data?: RoleResponse[];
      };
}

export interface PermissionsResponse {
  success?: boolean;
  message?: string;
  permissions?: PermissionResponse[];
  items?: PermissionResponse[];
  data?:
    | PermissionResponse[]
    | {
        permissions?: PermissionResponse[];
        items?: PermissionResponse[];
        data?: PermissionResponse[];
      };
}

export interface RoleDetails {
  id: number | string;
  name: string;
  displayName: string;
  guardName: string;
  description: string;
  scope?: string;
  condominiumId?: number | string | null;
  condominiumName?: string;
  permissions: string[];
  permissionIds: Array<number | string>;
  permissionsCount: number;
  updatedAt: string;
}

export interface PermissionDetails {
  id: number | string;
  name: string;
  code: string;
  group: string;
  scope: string;
  guardName: string;
  description: string;
  parentId: number | string | null;
  children: PermissionDetails[];
}

export interface MenuPermissionLink {
  id?: number | string;
  name?: string;
  group?: string | null;
  scope?: string | null;
}

export interface MenuItem {
  id: number | string;
  parent_id: number | string | null;
  code: string;
  label: string;
  route_name: string | null;
  path: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  required_permission: MenuPermissionLink | string | null;
  children?: MenuItem[] | null;
}

export interface MenuFlatItem extends MenuItem {
  depth: number;
  parentLabel: string;
  childrenCount: number;
}

export interface MenuFormPayload {
  code: string;
  label: string;
  route_name: string;
  path: string;
  icon: string;
  parent_id: number | string | null;
  sort_order: number;
  is_active: boolean;
  required_permission_name: string;
  required_permission_group: string;
  required_permission_scope: string;
}

import { computed, ref } from 'vue';
import type { MenuFlatItem, MenuFormPayload, MenuItem, MenuPermissionLink } from '../../interfaces/menus/menu.interface';

type MenuTreeItem = MenuItem & { children: MenuTreeItem[] };

function createPermission(name: string, group: string, scope: string): MenuPermissionLink {
  return {
    name,
    group,
    scope,
  };
}

const initialMenus: MenuTreeItem[] = [
  {
    id: 1,
    parent_id: null,
    code: 'admin.dashboard',
    label: 'Dashboard',
    route_name: null,
    path: '/',
    icon: 'layout-dashboard',
    sort_order: 1,
    is_active: true,
    required_permission: createPermission('Acceso administrativo', 'access', 'system'),
    children: [],
  },
  {
    id: 2,
    parent_id: null,
    code: 'admin.administration',
    label: 'Administracion',
    route_name: null,
    path: null,
    icon: 'building-2',
    sort_order: 10,
    is_active: true,
    required_permission: createPermission('Acceso administrativo', 'access', 'system'),
    children: [
      {
        id: 3,
        parent_id: 2,
        code: 'admin.condominiums',
        label: 'Condominios',
        route_name: null,
        path: '/admin/condominiums',
        icon: 'building-2',
        sort_order: 1,
        is_active: true,
        required_permission: createPermission('Administrar condominios', 'condominiums', 'system'),
        children: [],
      },
      {
        id: 4,
        parent_id: 2,
        code: 'admin.houses',
        label: 'Casas',
        route_name: null,
        path: '/admin/houses',
        icon: 'home',
        sort_order: 2,
        is_active: true,
        required_permission: createPermission('Administrar casas', 'condominiums', 'condominium'),
        children: [],
      },
      {
        id: 5,
        parent_id: 2,
        code: 'admin.residents',
        label: 'Residentes',
        route_name: null,
        path: '/admin/residents',
        icon: 'users-round',
        sort_order: 3,
        is_active: true,
        required_permission: createPermission('Administrar residentes', 'residents', 'condominium'),
        children: [],
      },
      {
        id: 6,
        parent_id: 2,
        code: 'admin.board',
        label: 'Directivas',
        route_name: null,
        path: '/admin/board',
        icon: 'users-round',
        sort_order: 4,
        is_active: true,
        required_permission: createPermission('Ver directivas', 'board', 'condominium'),
        children: [],
      },
    ],
  },
  {
    id: 7,
    parent_id: null,
    code: 'admin.billing',
    label: 'Facturacion',
    route_name: null,
    path: null,
    icon: 'receipt',
    sort_order: 20,
    is_active: true,
    required_permission: createPermission('Acceso administrativo', 'access', 'system'),
    children: [
      {
        id: 8,
        parent_id: 7,
        code: 'admin.fee-rates',
        label: 'Tarifas de alicuotas',
        route_name: null,
        path: '/admin/fee-rates',
        icon: 'badge-dollar-sign',
        sort_order: 1,
        is_active: true,
        required_permission: createPermission('Administrar alicuotas', 'billing', 'condominium'),
        children: [],
      },
      {
        id: 9,
        parent_id: 7,
        code: 'admin.fee-charges',
        label: 'Alicuotas',
        route_name: null,
        path: '/admin/fee-charges',
        icon: 'receipt-text',
        sort_order: 2,
        is_active: true,
        required_permission: createPermission('Administrar alicuotas', 'billing', 'condominium'),
        children: [],
      },
      {
        id: 10,
        parent_id: 7,
        code: 'admin.payments',
        label: 'Pagos',
        route_name: null,
        path: '/admin/payments',
        icon: 'credit-card',
        sort_order: 3,
        is_active: true,
        required_permission: createPermission('Administrar pagos', 'billing', 'condominium'),
        children: [],
      },
      {
        id: 11,
        parent_id: 7,
        code: 'admin.payment-methods',
        label: 'Metodos de pago',
        route_name: null,
        path: '/admin/payment-methods',
        icon: 'wallet-cards',
        sort_order: 4,
        is_active: true,
        required_permission: createPermission('Administrar metodos de pago', 'billing', 'condominium'),
        children: [],
      },
    ],
  },
  {
    id: 12,
    parent_id: null,
    code: 'admin.settings',
    label: 'Configuracion',
    route_name: null,
    path: null,
    icon: 'settings',
    sort_order: 30,
    is_active: true,
    required_permission: createPermission('Acceso administrativo', 'access', 'system'),
    children: [
      {
        id: 13,
        parent_id: 12,
        code: 'admin.catalogs',
        label: 'Catalogos',
        route_name: null,
        path: '/admin/catalogs',
        icon: 'list-tree',
        sort_order: 1,
        is_active: true,
        required_permission: createPermission('Administrar catalogos', 'catalogs', 'system'),
        children: [],
      },
      {
        id: 14,
        parent_id: 12,
        code: 'admin.menus',
        label: 'Menus',
        route_name: null,
        path: '/admin/menus',
        icon: 'panel-left',
        sort_order: 2,
        is_active: true,
        required_permission: createPermission('Administrar menus', 'security', 'system'),
        children: [],
      },
      {
        id: 15,
        parent_id: 12,
        code: 'admin.roles',
        label: 'Roles',
        route_name: null,
        path: '/admin/roles',
        icon: 'shield-user',
        sort_order: 3,
        is_active: true,
        required_permission: createPermission('Administrar roles', 'security', 'system'),
        children: [],
      },
      {
        id: 16,
        parent_id: 12,
        code: 'admin.audit-logs',
        label: 'Auditoria',
        route_name: null,
        path: '/admin/audit-logs',
        icon: 'shield-check',
        sort_order: 4,
        is_active: true,
        required_permission: createPermission('Ver auditoria', 'security', 'condominium'),
        children: [],
      },
    ],
  },
  {
    id: 17,
    parent_id: null,
    code: 'resident.home',
    label: 'Mi hogar',
    route_name: null,
    path: '/resident/houses',
    icon: 'home',
    sort_order: 100,
    is_active: true,
    required_permission: createPermission('Acceso residente', 'access', 'system'),
    children: [
      {
        id: 18,
        parent_id: 17,
        code: 'resident.statement',
        label: 'Estado de cuenta',
        route_name: null,
        path: '/resident/statement',
        icon: 'file-text',
        sort_order: 1,
        is_active: true,
        required_permission: createPermission('Ver estado de cuenta', 'resident', 'resident'),
        children: [],
      },
      {
        id: 19,
        parent_id: 17,
        code: 'resident.payments',
        label: 'Mis pagos',
        route_name: null,
        path: '/resident/payments',
        icon: 'credit-card',
        sort_order: 2,
        is_active: true,
        required_permission: createPermission('Ver pagos de casa', 'resident', 'resident'),
        children: [],
      },
      {
        id: 20,
        parent_id: 17,
        code: 'resident.advance-payments',
        label: 'Adelantar alicuotas',
        route_name: null,
        path: '/resident/advance-payments',
        icon: 'calendar-plus',
        sort_order: 3,
        is_active: true,
        required_permission: createPermission('Registrar pagos de casa', 'resident', 'resident'),
        children: [],
      },
      {
        id: 21,
        parent_id: 17,
        code: 'resident.invitations',
        label: 'Invitaciones',
        route_name: null,
        path: '/resident/invitations',
        icon: 'user-plus',
        sort_order: 4,
        is_active: true,
        required_permission: createPermission('Invitar usuarios a casa', 'resident', 'resident'),
        children: [],
      },
    ],
  },
];

function cloneTree(items: MenuTreeItem[]): MenuTreeItem[] {
  return items.map((item) => ({
    ...item,
    required_permission:
      typeof item.required_permission === 'object' && item.required_permission !== null
        ? { ...item.required_permission }
        : item.required_permission,
    children: cloneTree(item.children || []),
  }));
}

function sortTree(items: MenuTreeItem[]) {
  items.sort((first, second) => first.sort_order - second.sort_order);
  items.forEach((item) => sortTree(item.children));
}

function findMenuById(items: MenuTreeItem[], id: number | string): MenuTreeItem | null {
  for (const item of items) {
    if (String(item.id) === String(id)) {
      return item;
    }

    const child = findMenuById(item.children, id);
    if (child) {
      return child;
    }
  }

  return null;
}

function removeMenuById(
  items: MenuTreeItem[],
  id: number | string,
): { items: MenuTreeItem[]; removed: MenuTreeItem | null } {
  let removed: MenuTreeItem | null = null;

  const nextItems = items
    .map((item) => {
      if (String(item.id) === String(id)) {
        removed = item;
        return null;
      }

      const childResult = removeMenuById(item.children, id);
      if (childResult.removed) {
        removed = childResult.removed;
      }

      return {
        ...item,
        children: childResult.items,
      };
    })
    .filter(Boolean) as MenuTreeItem[];

  return { items: nextItems, removed };
}

function insertMenu(items: MenuTreeItem[], menu: MenuTreeItem, parentId: number | string | null) {
  if (parentId === null || parentId === undefined || parentId === '') {
    items.push(menu);
    return true;
  }

  for (const item of items) {
    if (String(item.id) === String(parentId)) {
      item.children.push(menu);
      return true;
    }

    const inserted = insertMenu(item.children, menu, parentId);
    if (inserted) {
      return true;
    }
  }

  return false;
}

function flattenTree(items: MenuTreeItem[], depth = 0, parentLabel = 'Raiz'): MenuFlatItem[] {
  return items.flatMap((item) => {
    const flatItem: MenuFlatItem = {
      ...item,
      required_permission:
        typeof item.required_permission === 'object' && item.required_permission !== null
          ? { ...item.required_permission }
          : item.required_permission,
      depth,
      parentLabel,
      childrenCount: item.children.length,
    };

    return [flatItem, ...flattenTree(item.children, depth + 1, item.label)];
  });
}

function createMenuFromPayload(id: number | string, payload: MenuFormPayload): MenuTreeItem {
  return {
    id,
    parent_id: payload.parent_id,
    code: payload.code.trim(),
    label: payload.label.trim(),
    route_name: payload.route_name.trim() || null,
    path: payload.path.trim() || null,
    icon: payload.icon.trim() || null,
    sort_order: Number(payload.sort_order) || 0,
    is_active: payload.is_active,
    required_permission: {
      name: payload.required_permission_name.trim() || 'Sin permiso',
      group: payload.required_permission_group.trim() || 'general',
      scope: payload.required_permission_scope.trim() || 'system',
    },
    children: [],
  };
}

export function useMenus() {
  const menus = ref<MenuTreeItem[]>(cloneTree(initialMenus));
  const selectedMenu = ref<MenuTreeItem | null>(menus.value[0] ?? null);
  const loading = ref(false);
  const saving = ref(false);
  const deletingId = ref<number | string | null>(null);
  const error = ref('');
  const nextMenuId = ref(1000);

  const flatMenus = computed(() => flattenTree(menus.value));
  const totalMenus = computed(() => flatMenus.value.length);
  const rootMenus = computed(() => menus.value.length);
  const activeMenus = computed(() => flatMenus.value.filter((menu) => menu.is_active).length);
  const branchMenus = computed(() => flatMenus.value.filter((menu) => menu.childrenCount > 0).length);

  function loadMenus() {
    loading.value = true;
    error.value = '';

    try {
      menus.value = cloneTree(initialMenus);
      selectedMenu.value = menus.value[0] ?? null;
    } catch (exception) {
      error.value = exception instanceof Error ? exception.message : 'No se pudieron cargar los menus';
      menus.value = [];
      selectedMenu.value = null;
    } finally {
      loading.value = false;
    }
  }

  function findMenuOptions(excludeIds?: Array<number | string> | number | string | null) {
    const exclusions = Array.isArray(excludeIds)
      ? excludeIds.map((value) => String(value))
      : excludeIds === null || excludeIds === undefined || excludeIds === ''
        ? []
        : [String(excludeIds)];

    return flatMenus.value
      .filter((menu) => !exclusions.includes(String(menu.id)))
      .map((menu) => ({
        label: `${'  '.repeat(menu.depth)}${menu.label}`,
        value: menu.id,
      }));
  }

  function getMenuById(id: number | string) {
    return findMenuById(menus.value, id);
  }

  function saveMenu(menuId: number | string | null, payload: MenuFormPayload) {
    saving.value = true;
    error.value = '';

    try {
      const nextTree = cloneTree(menus.value);
      const targetId = menuId ?? nextMenuId.value++;
      const nextMenu = createMenuFromPayload(targetId, payload);

      if (menuId !== null) {
        const removedResult = removeMenuById(nextTree, menuId);
        const insertParentId = nextMenu.parent_id === targetId ? null : nextMenu.parent_id;

        if (insertParentId === null) {
          removedResult.items.push(nextMenu);
        } else if (!insertMenu(removedResult.items, nextMenu, insertParentId)) {
          removedResult.items.push(nextMenu);
        }

        menus.value = removedResult.items;
      } else {
        const insertParentId = nextMenu.parent_id === targetId ? null : nextMenu.parent_id;

        if (insertParentId === null) {
          nextTree.push(nextMenu);
        } else if (!insertMenu(nextTree, nextMenu, insertParentId)) {
          nextTree.push(nextMenu);
        }

        menus.value = nextTree;
      }

      sortTree(menus.value);
      selectedMenu.value = getMenuById(targetId) || menus.value[0] || null;
    } catch (exception) {
      error.value = exception instanceof Error ? exception.message : 'No se pudo guardar el menu';
      throw exception;
    } finally {
      saving.value = false;
    }
  }

  function deleteMenu(menuId: number | string) {
    deletingId.value = menuId;
    error.value = '';

    try {
      const result = removeMenuById(cloneTree(menus.value), menuId);
      menus.value = result.items;
      sortTree(menus.value);

      if (selectedMenu.value && String(selectedMenu.value.id) === String(menuId)) {
        selectedMenu.value = menus.value[0] ?? null;
      }
    } catch (exception) {
      error.value = exception instanceof Error ? exception.message : 'No se pudo eliminar el menu';
    } finally {
      deletingId.value = null;
    }
  }

  return {
    menus,
    flatMenus,
    selectedMenu,
    loading,
    saving,
    deletingId,
    error,
    totalMenus,
    rootMenus,
    activeMenus,
    branchMenus,
    loadMenus,
    findMenuOptions,
    getMenuById,
    saveMenu,
    deleteMenu,
  };
}

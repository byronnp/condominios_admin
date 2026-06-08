<template>
  <q-page class="dashboard-page menus-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Configuracion</p>
        <h1>Gestion de menus</h1>
        <p>
          Organiza la navegacion del sistema, sus jerarquias, rutas y permisos requeridos para cada modulo.
        </p>
      </div>

      <div class="heading-actions">
        <q-btn outline color="primary" icon="refresh" label="Recargar" no-caps :disable="loading" @click="loadMenus" />
        <q-btn outline color="primary" icon="subdirectory_arrow_right" label="Nuevo hijo" no-caps :disable="!selectedMenu" @click="openCreateMenu(selectedMenu)" />
        <q-btn color="primary" icon="add" label="Nuevo menu" no-caps @click="openCreateMenu()" />
      </div>
    </section>

    <section class="stats-grid">
      <q-card v-for="item in stats" :key="item.label" class="panel stat-card">
        <q-card-section class="stat-card__body">
          <q-avatar :color="item.color" text-color="white" size="42px">
            <q-icon :name="item.icon" />
          </q-avatar>
          <div>
            <span class="text-caption text-grey-7">{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </div>
        </q-card-section>
      </q-card>
    </section>

    <section class="panel menus-info-panel">
      <div class="menus-info-panel__copy">
        <p class="eyebrow">Estructura del sistema</p>
        <h2>Los menus sin ruta actuan como secciones y los hijos heredan el contexto del padre</h2>
        <p>
          Esta vista permite crear, editar y eliminar nodos del arbol de navegacion. El icono se normaliza
          para los nombres del backend y los permisos se muestran como referencia de acceso.
        </p>
      </div>
      <div class="menus-info-panel__chips">
        <q-chip outline color="primary" icon="menu" :label="`${rootMenus} raices`" />
        <q-chip outline color="secondary" icon="account_tree" :label="`${branchMenus} con hijos`" />
        <q-chip outline color="positive" icon="verified" :label="`${activeMenus} activos`" />
      </div>
    </section>

    <q-banner v-if="error" rounded class="bg-red-1 text-negative q-mb-md">
      {{ error }}
      <template #action>
        <q-btn flat color="negative" label="Reintentar" no-caps @click="loadMenus" />
      </template>
    </q-banner>

    <section class="menus-layout">
      <section class="panel data-panel menus-table-panel">
        <div class="table-toolbar">
          <q-input
            v-model="filter"
            outlined
            dense
            debounce="250"
            placeholder="Buscar menu, codigo, ruta o permiso"
            class="soft-input table-toolbar__search"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <div class="table-toolbar__filters">
            <q-chip outline color="primary" icon="menu" :label="`${totalMenus} menus`" />
            <q-chip outline color="secondary" icon="account_tree" :label="`${rootMenus} raices`" />
          </div>
        </div>

        <q-table
          flat
          :rows="filteredMenus"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="{ rowsPerPage: 8 }"
          :grid="$q.screen.lt.md"
          class="soft-table menu-tree-table"
        >
          <template #body-cell-menu="props">
            <q-td :props="props">
              <div class="menu-tree-table__menu" :style="{ paddingLeft: `${props.row.depth * 18}px` }">
                <q-avatar color="primary" text-color="white" size="38px">
                  <q-icon :name="normalizeMenuIcon(props.row.icon)" />
                </q-avatar>
                <div>
                  <strong>{{ props.row.label }}</strong>
                  <span>{{ props.row.code }}</span>
                </div>
              </div>
            </q-td>
          </template>

          <template #body-cell-route="props">
            <q-td :props="props">
              <div class="menu-route-cell">
                <strong>{{ props.row.path || 'Sin ruta' }}</strong>
                <span>{{ props.row.route_name || 'Sin nombre de ruta' }}</span>
              </div>
            </q-td>
          </template>

          <template #body-cell-parent="props">
            <q-td :props="props">
              <span>{{ props.row.parentLabel }}</span>
            </q-td>
          </template>

          <template #body-cell-permission="props">
            <q-td :props="props">
              <div class="menu-permission-cell">
                <q-badge v-if="permissionName(props.row)" outline color="primary" :label="permissionName(props.row)" />
                <q-badge outline color="secondary" :label="permissionScope(props.row)" />
              </div>
            </q-td>
          </template>

          <template #body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="props.row.is_active ? 'positive' : 'grey'" :label="props.row.is_active ? 'Activo' : 'Inactivo'" class="status-badge" />
            </q-td>
          </template>

          <template #body-cell-actions="props">
            <q-td :props="props">
              <div class="row-actions">
                <q-btn flat round dense color="primary" icon="visibility" @click="openMenuDetails(props.row)">
                  <q-tooltip>Ver detalle</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="primary" icon="subdirectory_arrow_right" @click="openCreateMenu(props.row)">
                  <q-tooltip>Nuevo hijo</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="primary" icon="edit" @click="openEditMenu(props.row)">
                  <q-tooltip>Editar menu</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  dense
                  color="negative"
                  icon="delete"
                  :loading="deletingId === props.row.id"
                  :disable="deletingId !== null && deletingId !== props.row.id"
                  @click="confirmDelete(props.row)"
                >
                  <q-tooltip>Eliminar menu</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>

          <template #item="props">
            <div class="menu-grid-card">
              <div class="menu-grid-card__header">
                <div class="menu-tree-table__menu" :style="{ paddingLeft: `${props.row.depth * 14}px` }">
                  <q-avatar color="primary" text-color="white" size="38px">
                    <q-icon :name="normalizeMenuIcon(props.row.icon)" />
                  </q-avatar>
                  <div>
                    <strong>{{ props.row.label }}</strong>
                    <span>{{ props.row.code }}</span>
                  </div>
                </div>
                <q-badge :color="props.row.is_active ? 'positive' : 'grey'" :label="props.row.is_active ? 'Activo' : 'Inactivo'" class="status-badge" />
              </div>

              <div class="menu-grid-card__details">
                <span>Ruta<strong>{{ props.row.path || 'Sin ruta' }}</strong></span>
                <span>Padre<strong>{{ props.row.parentLabel }}</strong></span>
                <span>Orden<strong>{{ props.row.sort_order }}</strong></span>
                <span>Permiso<strong>{{ permissionName(props.row) || 'Sin permiso' }}</strong></span>
              </div>

              <div class="row-actions row-actions--mobile">
                <q-btn flat round dense color="primary" icon="visibility" @click="openMenuDetails(props.row)">
                  <q-tooltip>Ver detalle</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="primary" icon="subdirectory_arrow_right" @click="openCreateMenu(props.row)">
                  <q-tooltip>Nuevo hijo</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="primary" icon="edit" @click="openEditMenu(props.row)">
                  <q-tooltip>Editar menu</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  dense
                  color="negative"
                  icon="delete"
                  :loading="deletingId === props.row.id"
                  :disable="deletingId !== null && deletingId !== props.row.id"
                  @click="confirmDelete(props.row)"
                >
                  <q-tooltip>Eliminar menu</q-tooltip>
                </q-btn>
              </div>
            </div>
          </template>
        </q-table>
      </section>

      <aside class="panel menus-detail-panel">
        <div v-if="selectedMenu" class="menus-detail-panel__content">
          <div class="menus-detail-panel__hero">
            <q-avatar size="54px" color="primary" text-color="white">
              <q-icon :name="normalizeMenuIcon(selectedMenu.icon)" />
            </q-avatar>
            <div>
              <p class="eyebrow">Menu seleccionado</p>
              <h2>{{ selectedMenu.label }}</h2>
              <p>{{ selectedMenu.code }}</p>
            </div>
          </div>

          <div class="menus-detail-panel__stats">
            <article class="menus-detail-panel__stat">
              <span>Ruta</span>
              <strong>{{ selectedMenu.path || 'Sin ruta' }}</strong>
            </article>
            <article class="menus-detail-panel__stat">
              <span>Padre</span>
              <strong>{{ selectedMenu.parent_id === null ? 'Raiz' : parentLabel(selectedMenu.parent_id) }}</strong>
            </article>
            <article class="menus-detail-panel__stat">
              <span>Permiso</span>
              <strong>{{ permissionName(selectedMenu) || 'Sin permiso' }}</strong>
            </article>
            <article class="menus-detail-panel__stat">
              <span>Estado</span>
              <strong>{{ selectedMenu.is_active ? 'Activo' : 'Inactivo' }}</strong>
            </article>
          </div>

          <div class="menus-detail-panel__chips">
            <q-chip outline color="primary" :label="`Orden ${selectedMenu.sort_order}`" />
            <q-chip outline color="secondary" :label="permissionGroup(selectedMenu) || 'general'" />
            <q-chip outline color="accent" :label="permissionScope(selectedMenu)" />
          </div>

          <div class="menus-detail-panel__block">
            <div class="panel-header panel-header--stacked">
              <div>
                <h2>Hijos directos</h2>
                <p>{{ selectedMenu.children.length }} nodos relacionados</p>
              </div>
              <q-btn flat color="primary" icon="subdirectory_arrow_right" label="Nuevo hijo" no-caps @click="openCreateMenu(selectedMenu)" />
            </div>

            <q-banner v-if="selectedMenu.children.length === 0" rounded class="bg-grey-2 text-grey-8">
              Este menu no tiene hijos registrados.
            </q-banner>

            <q-list v-else dense class="menu-children-list">
              <q-item v-for="child in selectedMenu.children" :key="child.id" class="menu-children-list__item">
                <q-item-section avatar>
                  <q-avatar size="34px" color="primary" text-color="white">
                    <q-icon :name="normalizeMenuIcon(child.icon)" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ child.label }}</q-item-label>
                  <q-item-label caption>{{ child.path || 'Sin ruta' }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn flat round dense color="primary" icon="edit" @click="openEditMenu(child)">
                    <q-tooltip>Editar</q-tooltip>
                  </q-btn>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>

        <div v-else class="empty-state">
          <q-icon name="menu" />
          <strong>Sin menu seleccionado</strong>
          <span>Selecciona un menu de la tabla para ver su estructura y acciones rapidas.</span>
        </div>
      </aside>
    </section>

    <MenuFormDialog
      v-model="showMenuDialog"
      :menu="menuToEdit"
      :saving="saving"
      :parent-options="parentOptions"
      :initial-parent-id="initialParentId"
      @save="saveMenuHandler"
    />

    <ConfirmDialog
      v-model="showDeleteDialog"
      title="Eliminar menu"
      :message="deleteDialogMessage"
      subtitle="Confirma antes de continuar."
      hint="Esta accion eliminara el nodo seleccionado y sus referencias hijas."
      confirm-label="Eliminar"
      cancel-label="Cancelar"
      confirm-color="negative"
      confirm-icon="delete"
      icon="delete"
      icon-color="negative"
      @confirm="deleteSelectedMenu"
    />

    <q-inner-loading :showing="loading">
      <q-spinner color="primary" size="42px" />
    </q-inner-loading>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { QTableColumn } from 'quasar';
import ConfirmDialog from 'components/general/ConfirmDialog.vue';
import MenuFormDialog from './components/MenuFormDialog.vue';
import { normalizeMenuIcon } from '../../composables/shared/menu-icons';
import { useMenus } from '../../composables/menus/useMenus';
import type { MenuFlatItem, MenuFormPayload, MenuItem } from '../../interfaces/menus/menu.interface';

const filter = ref('');
const showMenuDialog = ref(false);
const showDeleteDialog = ref(false);
const menuToEdit = ref<MenuItem | null>(null);
const menuToDelete = ref<MenuFlatItem | MenuItem | null>(null);
const initialParentId = ref<number | string | null>(null);
const selectedMenuId = ref<number | string | null>(null);

const {
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
} = useMenus();

const columns: QTableColumn<MenuFlatItem>[] = [
  { name: 'menu', label: 'Menu', field: 'label', align: 'left', sortable: true },
  { name: 'route', label: 'Ruta', field: 'path', align: 'left', sortable: true },
  { name: 'parent', label: 'Padre', field: 'parentLabel', align: 'left', sortable: true },
  { name: 'permission', label: 'Permiso', field: 'required_permission', align: 'left', sortable: true },
  { name: 'sort_order', label: 'Orden', field: 'sort_order', align: 'right', sortable: true },
  { name: 'status', label: 'Estado', field: 'is_active', align: 'left', sortable: true },
  { name: 'actions', label: 'Acciones', field: 'id', align: 'right' },
];

const stats = computed(() => [
  {
    label: 'Menus',
    value: String(totalMenus.value),
    icon: 'menu',
    color: 'primary',
  },
  {
    label: 'Raices',
    value: String(rootMenus.value),
    icon: 'account_tree',
    color: 'secondary',
  },
  {
    label: 'Con hijos',
    value: String(branchMenus.value),
    icon: 'subdirectory_arrow_right',
    color: 'accent',
  },
  {
    label: 'Activos',
    value: String(activeMenus.value),
    icon: 'verified',
    color: 'positive',
  },
]);

const filteredMenus = computed(() => {
  const term = filter.value.trim().toLowerCase();

  if (!term) {
    return flatMenus.value;
  }

  return flatMenus.value.filter((menu) => {
    const permission = permissionName(menu);
    const permissionGroupValue = permissionGroup(menu);
    const permissionScopeValue = permissionScope(menu);

    return [menu.label, menu.code, menu.path || '', menu.route_name || '', menu.parentLabel, permission, permissionGroupValue, permissionScopeValue]
      .join(' ')
      .toLowerCase()
      .includes(term);
  });
});

const parentOptions = computed(() => [
  { label: 'Sin padre', value: null },
  ...findMenuOptions(menuToEdit.value ? collectDescendantIds(menuToEdit.value).concat(menuToEdit.value.id) : null),
]);

const deleteDialogMessage = computed(() =>
  menuToDelete.value
    ? `¿Deseas eliminar ${menuToDelete.value.label}? Esta accion no se puede deshacer.`
    : '¿Deseas eliminar este menu? Esta accion no se puede deshacer.',
);

function permissionName(menu: MenuItem | MenuFlatItem | null | undefined) {
  if (!menu || typeof menu.required_permission !== 'object' || menu.required_permission === null) {
    return '';
  }

  return menu.required_permission.name || '';
}

function permissionGroup(menu: MenuItem | MenuFlatItem | null | undefined) {
  if (!menu || typeof menu.required_permission !== 'object' || menu.required_permission === null) {
    return '';
  }

  return menu.required_permission.group || '';
}

function permissionScope(menu: MenuItem | MenuFlatItem | null | undefined) {
  if (!menu || typeof menu.required_permission !== 'object' || menu.required_permission === null) {
    return '';
  }

  const scope = menu.required_permission.scope || '';
  if (scope === 'system') {
    return 'Sistema';
  }

  if (scope === 'condominium') {
    return 'Condominio';
  }

  if (scope === 'resident') {
    return 'Residente';
  }

  return scope;
}

function parentLabel(parentId: number | string | null) {
  if (parentId === null || parentId === undefined) {
    return 'Raiz';
  }

  return getMenuById(parentId)?.label || 'Sin padre';
}

function collectDescendantIds(menu: MenuItem): Array<number | string> {
  return (menu.children || []).flatMap((child) => [child.id, ...collectDescendantIds(child)]);
}

function openMenuDetails(menu: MenuFlatItem | MenuItem) {
  const fullMenu = getMenuById(menu.id);
  selectedMenu.value = fullMenu;
  selectedMenuId.value = menu.id;
}

function openCreateMenu(parent?: MenuFlatItem | MenuItem | null) {
  menuToEdit.value = null;
  initialParentId.value = parent?.id ?? null;
  showMenuDialog.value = true;
}

function openEditMenu(menu: MenuFlatItem | MenuItem) {
  const fullMenu = getMenuById(menu.id);
  menuToEdit.value = fullMenu || menu;
  initialParentId.value = menu.parent_id ?? null;
  selectedMenu.value = fullMenu || selectedMenu.value;
  selectedMenuId.value = menu.id;
  showMenuDialog.value = true;
}

function saveMenuHandler(payload: MenuFormPayload) {
  try {
    const editedId = menuToEdit.value?.id ?? null;
    saveMenu(menuToEdit.value?.id ?? null, payload);
    if (editedId !== null && editedId !== undefined) {
      const nextMenu = getMenuById(editedId);
      if (nextMenu) {
        selectedMenu.value = nextMenu;
        selectedMenuId.value = nextMenu.id;
      }
    }
    showMenuDialog.value = false;
    menuToEdit.value = null;
    initialParentId.value = null;
  } catch {
    return;
  }
}

function confirmDelete(menu: MenuFlatItem | MenuItem) {
  menuToDelete.value = menu;
  showDeleteDialog.value = true;
}

function deleteSelectedMenu() {
  if (!menuToDelete.value) {
    return;
  }

  deleteMenu(menuToDelete.value.id);

  if (selectedMenu.value && String(selectedMenu.value.id) === String(menuToDelete.value.id)) {
    selectedMenu.value = null;
    selectedMenuId.value = null;
  }

  menuToDelete.value = null;
  showDeleteDialog.value = false;
}

onMounted(() => {
  loadMenus();
});
</script>

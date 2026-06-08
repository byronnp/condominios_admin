<template>
  <q-page class="dashboard-page role-permissions-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Gestion de roles</p>
        <h1>Permisos del rol</h1>
        <p>Organiza los permisos por modulo y guarda la configuracion del rol seleccionado.</p>
      </div>

      <div class="heading-actions">
        <q-btn outline color="primary" icon="arrow_back" label="Volver" no-caps :to="{ name: 'roles' }" />
        <q-btn outline color="primary" icon="refresh" label="Recargar" no-caps :disable="loadingPage" @click="loadPage" />
        <q-btn
          color="primary"
          icon="verified_user"
          label="Guardar permisos"
          no-caps
          :loading="savingPermissions"
          :disable="loadingPage || !selectedRole"
          @click="savePermissions"
        />
      </div>
    </section>

    <q-banner v-if="error" rounded class="bg-red-1 text-negative q-mb-md">
      {{ error }}
      <template #action>
        <q-btn flat color="negative" label="Reintentar" no-caps @click="loadPage" />
      </template>
    </q-banner>

    <q-banner v-if="successMessage" rounded class="bg-green-1 text-positive q-mb-md">
      {{ successMessage }}
    </q-banner>

    <section class="role-permissions-page__layout">
      <aside class="panel role-permissions-page__aside">
        <div class="role-permissions-page__role-hero">
          <q-avatar size="54px" color="primary" text-color="white" icon="admin_panel_settings" />
          <div>
            <p class="eyebrow">Rol seleccionado</p>
            <h2>{{ selectedRole?.displayName || 'Sin rol cargado' }}</h2>
            <p>{{ selectedRole?.description || 'Carga el rol para administrar sus permisos.' }}</p>
          </div>
        </div>

        <div class="role-permissions-page__role-stats">
          <article class="role-permissions-page__stat">
            <span>Alcance</span>
            <strong>{{ scopeLabel(selectedRole?.scope) }}</strong>
          </article>
          <article class="role-permissions-page__stat">
            <span>Condominio</span>
            <strong>{{ selectedRole?.condominiumName || 'Global' }}</strong>
          </article>
          <article class="role-permissions-page__stat">
            <span>Permisos activos</span>
            <strong>{{ selectedPermissions.length }}</strong>
          </article>
          <article class="role-permissions-page__stat">
            <span>Disponibles</span>
            <strong>{{ permissions.length }}</strong>
          </article>
        </div>

        <div class="role-permissions-page__aside-note">
          <q-icon name="tips_and_updates" />
          <p>
            Los permisos se muestran agrupados por modulo para facilitar la lectura y la revision por alcance.
          </p>
        </div>
      </aside>

      <section class="panel role-permissions-page__main">
        <div class="role-permissions-dialog__summary">
          <div class="role-permissions-dialog__summary-top">
            <div class="role-permissions-dialog__hero">
              <q-avatar size="48px" color="primary" text-color="white" icon="account_tree" />
              <div>
                <strong>{{ selectedRole?.displayName || 'Rol seleccionado' }}</strong>
                <span>{{ selectedRole?.description || 'Gestiona permisos desde bloques agrupados por modulo.' }}</span>
              </div>
            </div>

            <q-chip v-if="permissions.length > 0" outline color="primary" icon="verified_user" class="role-count-chip">
              {{ selectedPermissions.length }} / {{ permissions.length }}
            </q-chip>
          </div>

          <div class="role-permissions-dialog__stats">
            <article class="role-permissions-dialog__stat">
              <span>Disponibles</span>
              <strong>{{ permissions.length }}</strong>
            </article>
            <article class="role-permissions-dialog__stat">
              <span>Marcados</span>
              <strong>{{ selectedPermissions.length }}</strong>
            </article>
          </div>
        </div>

        <div class="role-permissions-dialog__toolbar role-permissions-page__toolbar">
          <q-input
            v-model="search"
            outlined
            dense
            placeholder="Buscar permiso"
            class="soft-input role-permissions-dialog__search"
            :disable="savingPermissions || permissions.length === 0"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <div class="role-permissions-dialog__actions">
            <q-btn
              outline
              color="primary"
              label="Seleccionar todo"
              no-caps
              :disable="savingPermissions || permissions.length === 0"
              @click="selectAll"
            />
            <q-btn
              flat
              color="primary"
              label="Limpiar"
              no-caps
              :disable="savingPermissions || selectedPermissions.length === 0"
              @click="clearSelection"
            />
          </div>
        </div>

        <q-banner v-if="permissions.length === 0" rounded class="bg-grey-2 text-grey-8">
          No hay permisos disponibles para mostrar.
        </q-banner>

        <q-banner v-else-if="filteredPermissionTree.length === 0" rounded class="bg-grey-2 text-grey-8">
          No hay coincidencias para el filtro actual.
        </q-banner>

        <q-scroll-area v-else class="role-permissions-page__scroll">
          <q-tree
            v-model:ticked="selectedPermissions"
            :nodes="filteredPermissionTree"
            node-key="id"
            label-key="label"
            children-key="children"
            dense
            no-connectors
            default-expand-all
            tick-strategy="strict"
            class="role-permissions-tree"
          >
            <template #default-header="scope">
              <div :class="['role-permissions-tree__node', { 'role-permissions-tree__node--group': scope.node.noTick === true }]">
                <div class="role-permissions-tree__node-main">
                  <q-avatar
                    v-if="scope.node.noTick === true"
                    size="34px"
                    color="primary"
                    text-color="white"
                    class="role-permissions-tree__group-avatar"
                  >
                    <q-icon :name="groupIcon(scope.node.group)" size="18px" />
                  </q-avatar>
                  <q-avatar
                    v-else
                    size="34px"
                    color="secondary"
                    text-color="white"
                    class="role-permissions-tree__group-avatar"
                  >
                    <q-icon name="verified_user" size="18px" />
                  </q-avatar>
                  <strong>{{ scope.node.name }}</strong>
                  <small>
                    {{
                      scope.node.noTick === true
                        ? scope.node.description || 'Grupo de permisos'
                        : scope.node.description || 'Sin descripcion'
                    }}
                  </small>
                </div>

                <div class="role-permissions-tree__node-meta">
                  <q-badge
                    v-if="scope.node.noTick === true"
                    outline
                    color="primary"
                    :label="`${scope.node.children?.length || 0} permisos`"
                  />
                  <template v-else>
                    <q-badge v-if="scope.node.code" outline color="primary" :label="scope.node.code" />
                    <q-badge outline color="secondary" :label="scopeLabel(scope.node.scope)" />
                  </template>
                  <q-badge
                    v-if="scope.node.noTick !== true && scope.node.children && scope.node.children.length > 0"
                    outline
                    color="accent"
                    :label="`${scope.node.children.length} hijos`"
                  />
                </div>
              </div>
            </template>
          </q-tree>
        </q-scroll-area>
      </section>
    </section>

    <q-inner-loading :showing="loadingPage">
      <q-spinner color="primary" size="42px" />
    </q-inner-loading>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useRoles } from '../../composables/roles/useRoles';
import type { PermissionDetails, RoleDetails } from '../../interfaces/roles/role.interface';

type PermissionTreeNode = Omit<PermissionDetails, 'children'> & {
  label: string;
  children: PermissionTreeNode[];
  tickable?: boolean;
  noTick?: boolean;
};

const route = useRoute();
const search = ref('');
const selectedPermissions = ref<Array<number | string>>([]);
const selectedRole = ref<RoleDetails | null>(null);
const successMessage = ref('');

const {
  permissions,
  loadingRoleId,
  permissionsLoading,
  permissionsSavingId,
  error,
  loadPermissions,
  loadRole,
  saveRolePermissions,
} = useRoles();

const roleId = computed(() => {
  const value = route.params.id;

  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return typeof value === 'string' ? value : '';
});

const loadingPage = computed(() => {
  if (!roleId.value) {
    return false;
  }

  return loadingRoleId.value === roleId.value || permissionsLoading.value;
});

const savingPermissions = computed(() => permissionsSavingId.value === roleId.value);

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function scopeLabel(scope?: string) {
  if (!scope || scope === 'system') {
    return 'Sistema';
  }

  if (scope === 'condominium') {
    return 'Condominio';
  }

  return scope;
}

function groupLabel(group: string) {
  const labels: Record<string, string> = {
    access: 'Acceso',
    billing: 'Facturacion',
    condominiums: 'Condominios',
    residents: 'Residentes',
    board: 'Directiva',
    resident: 'Residente',
    security: 'Seguridad',
    catalogs: 'Catalogos',
    general: 'General',
  };

  return labels[group] || group;
}

function groupIcon(group: string) {
  const icons: Record<string, string> = {
    access: 'vpn_key',
    billing: 'payments',
    condominiums: 'apartment',
    residents: 'groups',
    board: 'diversity_3',
    resident: 'person',
    security: 'shield',
    catalogs: 'category',
    general: 'account_tree',
  };

  return icons[group] || 'account_tree';
}

function buildPermissionTree(items: PermissionDetails[]): PermissionTreeNode[] {
  const nodesById = new Map<string, PermissionTreeNode>();

  items.forEach((permission) => {
    nodesById.set(String(permission.id), {
      ...permission,
      label: permission.name,
      children: [] as PermissionTreeNode[],
    });
  });

  const groups = new Map<string, PermissionTreeNode>();

  items.forEach((permission) => {
    const node = nodesById.get(String(permission.id));

    if (!node) {
      return;
    }

    const groupKey = permission.group || 'general';
    if (!groups.has(groupKey)) {
      groups.set(groupKey, {
        id: `group:${groupKey}`,
        name: groupLabel(groupKey),
        label: groupLabel(groupKey),
        code: '',
        group: groupKey,
        scope: permission.scope || 'system',
        guardName: 'Sin guard',
        description: `Permisos agrupados bajo ${groupLabel(groupKey).toLowerCase()}.`,
        parentId: null,
        children: [],
        noTick: true,
        tickable: false,
      });
    }

    const parentId =
      permission.parentId === null || permission.parentId === undefined || permission.parentId === ''
        ? null
        : String(permission.parentId);

    const parent = parentId ? nodesById.get(parentId) : null;
    if (parent && parent.group === node.group) {
      parent.children.push(node);
      return;
    }

    groups.get(groupKey)?.children.push(node);
  });

  const sortNodes = (nodes: PermissionTreeNode[]) => {
    nodes.sort((first, second) => {
      const groupComparison = groupLabel(first.group).localeCompare(groupLabel(second.group));

      if (groupComparison !== 0) {
        return groupComparison;
      }

      return first.name.localeCompare(second.name);
    });

    nodes.forEach((node) => sortNodes(node.children));
  };

  const roots = [...groups.values()];
  roots.forEach((groupNode) => sortNodes(groupNode.children));
  roots.sort((first, second) => groupLabel(first.group).localeCompare(groupLabel(second.group)));
  return roots;
}

function matchesPermission(permission: PermissionTreeNode, term: string) {
  if (!term) {
    return true;
  }

  const searchableText = [
    permission.name,
    permission.description || '',
    permission.code || '',
    permission.group,
    permission.scope,
  ]
    .join(' ')
    .toLowerCase();

  return normalizeText(searchableText).includes(term);
}

function filterPermissionTree(nodes: PermissionTreeNode[], term: string): PermissionTreeNode[] {
  if (!term) {
    return nodes;
  }

  return nodes
    .map((node) => {
      const filteredChildren = filterPermissionTree(node.children, term);

      if (matchesPermission(node, term) || filteredChildren.length > 0) {
        return {
          ...node,
          children: filteredChildren,
        };
      }

      return null;
    })
    .filter((node): node is PermissionTreeNode => node !== null);
}

const permissionTree = computed(() => buildPermissionTree(permissions.value));

const filteredPermissionTree = computed(() => {
  const term = normalizeText(search.value.trim());
  return filterPermissionTree(permissionTree.value, term);
});

async function loadPage() {
  successMessage.value = '';

  if (!roleId.value) {
    selectedRole.value = null;
    return;
  }

  await loadPermissions();

  const role = await loadRole(roleId.value);
  selectedRole.value = role;
  selectedPermissions.value = [...(role?.permissionIds || [])];
}

function selectAll() {
  selectedPermissions.value = permissions.value.map((permission) => permission.id);
}

function clearSelection() {
  selectedPermissions.value = [];
}

async function savePermissions() {
  if (!selectedRole.value) {
    return;
  }

  try {
    await saveRolePermissions(selectedRole.value.id, selectedPermissions.value);
    const refreshedRole = await loadRole(selectedRole.value.id);
    selectedRole.value = refreshedRole || selectedRole.value;
    selectedPermissions.value = [...(selectedRole.value?.permissionIds || selectedPermissions.value)];
    successMessage.value = 'Permisos guardados correctamente.';
  } catch {
    return;
  }
}

watch(
  () => route.params.id,
  () => {
    void loadPage();
  },
);

onMounted(() => {
  void loadPage();
});
</script>

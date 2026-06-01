<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="emit('update:modelValue', $event)">
    <q-card class="details-dialog role-dialog role-dialog--permissions">
      <q-card-section class="details-dialog__header">
        <div class="details-dialog__identity">
          <div>
            <h2>Permisos del rol</h2>
            <span>{{ role?.displayName || role?.name || 'Rol seleccionado' }}</span>
          </div>
        </div>

        <div class="details-dialog__header-actions">
          <q-chip v-if="permissions.length > 0" outline color="primary" icon="verified_user" class="role-count-chip">
            {{ selectedPermissions.length }} / {{ permissions.length }}
          </q-chip>
          <q-btn flat round dense icon="close" aria-label="Cerrar dialogo" v-close-popup />
        </div>
      </q-card-section>

      <q-separator />

      <q-form @submit.prevent="emitSave">
        <q-card-section class="role-permissions-dialog__body">
          <section class="role-permissions-dialog__summary">
            <div class="role-permissions-dialog__summary-top">
              <div class="role-permissions-dialog__hero">
                <q-avatar size="48px" color="primary" text-color="white" icon="account_tree" />
                <div>
                  <strong>{{ role?.displayName || role?.name || 'Rol seleccionado' }}</strong>
                  <span>{{ role?.description || 'Gestiona permisos desde un arbol jerarquico.' }}</span>
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
          </section>

          <section class="role-permissions-dialog__content">
            <div class="role-permissions-dialog__toolbar">
              <q-input
                v-model="search"
                outlined
                dense
                placeholder="Buscar permiso"
                class="soft-input role-permissions-dialog__search"
                :disable="saving || permissions.length === 0"
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
                  :disable="saving || permissions.length === 0"
                  @click="selectAll"
                />
                <q-btn
                  flat
                  color="primary"
                  label="Limpiar"
                  no-caps
                  :disable="saving || selectedPermissions.length === 0"
                  @click="clearSelection"
                />
              </div>
            </div>

            <q-banner v-if="permissions.length === 0" rounded class="bg-grey-2 text-grey-8">
              No hay permisos disponibles para mostrar.
            </q-banner>

            <q-banner v-else-if="filteredTreeNodes.length === 0" rounded class="bg-grey-2 text-grey-8">
              No hay coincidencias para el filtro actual.
            </q-banner>

            <q-scroll-area v-else class="role-permissions-dialog__scroll">
              <q-tree
                :nodes="filteredTreeNodes"
                node-key="id"
                label-key="label"
                children-key="children"
                tick-strategy="leaf"
                v-model:ticked="selectedPermissions"
                v-model:expanded="expandedNodes"
                no-connectors
                dense
                class="role-permissions-tree"
              >
                <template #default-header="prop">
                  <div class="role-permissions-tree__node" :class="{ 'role-permissions-tree__node--selected': isSelected(prop.node.id) }">
                    <div class="role-permissions-tree__node-main">
                      <strong>{{ prop.node.label }}</strong>
                      <small>{{ prop.node.description }}</small>
                    </div>

                    <q-badge
                      v-if="prop.node.code"
                      outline
                      color="primary"
                      :label="prop.node.code"
                      class="role-permissions-tree__code"
                    />
                  </div>
                </template>
              </q-tree>
            </q-scroll-area>
          </section>
        </q-card-section>

        <q-card-actions align="right" class="details-dialog__actions">
          <q-btn flat color="primary" label="Cancelar" no-caps v-close-popup :disable="saving" />
          <q-btn color="primary" icon="verified_user" label="Guardar permisos" no-caps :loading="saving" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { PermissionDetails, RoleDetails } from '../../interfaces/roles/role.interface';

type PermissionTreeNode = PermissionDetails & {
  label: string;
  children: PermissionTreeNode[];
};

const props = defineProps<{
  modelValue: boolean;
  role: RoleDetails | null;
  permissions: PermissionDetails[];
  saving?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  save: [permissions: Array<number | string>];
}>();

const search = ref('');
const selectedPermissions = ref<Array<number | string>>([]);
const expandedNodes = ref<Array<number | string>>([]);
const saving = computed(() => props.saving === true);

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function getNodeLabel(permission: PermissionDetails) {
  return permission.code ? `${permission.name} · ${permission.code}` : permission.name;
}

function buildPermissionTree(items: PermissionDetails[]) {
  const itemsById = new Map<string, PermissionTreeNode>();

  items.forEach((item) => {
    itemsById.set(String(item.id), {
      ...item,
      label: getNodeLabel(item),
      children: [],
    });
  });

  const roots: PermissionTreeNode[] = [];

  items.forEach((item) => {
    const node = itemsById.get(String(item.id));
    if (!node) {
      return;
    }

    const parentId = item.parentId;
    const parent = parentId !== null && parentId !== undefined ? itemsById.get(String(parentId)) : null;

    if (parent) {
      parent.children.push(node);
      return;
    }

    roots.push(node);
  });

  const sortNodes = (nodes: PermissionTreeNode[]) => {
    nodes.sort((first, second) => first.label.localeCompare(second.label));
    nodes.forEach((node) => sortNodes(node.children));
  };

  sortNodes(roots);
  return roots;
}

function filterTree(nodes: PermissionTreeNode[], term: string): PermissionTreeNode[] {
  if (!term) {
    return nodes;
  }

  return nodes
    .map((node) => {
      const children = filterTree(node.children, term);
      const matches =
        normalizeText(node.label).includes(term) ||
        normalizeText(node.description || '').includes(term) ||
        normalizeText(node.code || '').includes(term) ||
        normalizeText(node.guardName || '').includes(term);

      if (matches || children.length > 0) {
        return {
          ...node,
          children,
        };
      }

      return null;
    })
    .filter((node): node is PermissionTreeNode => node !== null);
}

const treeNodes = computed(() => buildPermissionTree(props.permissions));

const filteredTreeNodes = computed(() => {
  const term = normalizeText(search.value.trim());
  return filterTree(treeNodes.value, term);
});

watch(
  () => props.modelValue,
  (visible) => {
    if (!visible) {
      return;
    }

    search.value = '';
    selectedPermissions.value = [...(props.role?.permissionIds || [])];
    expandedNodes.value = treeNodes.value.map((node) => node.id);
  },
  { immediate: true },
);

watch(
  () => props.role,
  (role) => {
    if (!props.modelValue) {
      return;
    }

    selectedPermissions.value = [...(role?.permissionIds || [])];
  },
);

watch(
  () => props.permissions,
  () => {
    if (!props.modelValue) {
      return;
    }

    const availableIds = new Set(props.permissions.map((permission) => String(permission.id)));
    selectedPermissions.value = selectedPermissions.value.filter((value) => availableIds.has(String(value)));
    expandedNodes.value = treeNodes.value.map((node) => node.id);
  },
);

function isSelected(permissionId: number | string | undefined) {
  return permissionId !== undefined && selectedPermissions.value.some((value) => String(value) === String(permissionId));
}

function selectAll() {
  selectedPermissions.value = props.permissions.map((permission) => permission.id);
  expandedNodes.value = treeNodes.value.map((node) => node.id);
}

function clearSelection() {
  selectedPermissions.value = [];
}

function emitSave() {
  emit(
    'save',
    selectedPermissions.value.map((value) => {
      const numericValue = Number(value);
      return Number.isFinite(numericValue) && String(numericValue) === String(value) ? numericValue : value;
    }),
  );
}
</script>

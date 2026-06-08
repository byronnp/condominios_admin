<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="emit('update:modelValue', $event)">
    <q-card class="details-dialog menu-dialog menu-dialog--form">
      <q-card-section class="details-dialog__header">
        <div class="details-dialog__identity">
          <q-avatar size="54px" color="primary" text-color="white" icon="menu" />
          <div>
            <h2>{{ dialogTitle }}</h2>
            <span>Define jerarquia, ruta, icono y permisos base para el menu.</span>
          </div>
        </div>

        <q-btn flat round dense icon="close" aria-label="Cerrar dialogo" v-close-popup />
      </q-card-section>

      <q-separator />

      <q-form ref="formRef" @submit.prevent="emitSave">
        <q-card-section class="menu-dialog__body">
          <div class="menu-dialog__helper">
            <q-avatar size="36px" color="primary" text-color="white">
              <q-icon :name="previewIcon" />
            </q-avatar>
            <div>
              <p>
                Los menus sin ruta funcionan como secciones. Los menus con padre se presentan como hijos del
                bloque seleccionado.
              </p>
              <small>Icono de vista previa: {{ normalizeMenuIcon(form.icon) }}</small>
            </div>
          </div>

          <div class="dialog-form-grid">
            <q-input
              v-model="form.label"
              outlined
              dense
              autofocus
              label="Etiqueta"
              class="soft-input"
              hide-bottom-space
              :rules="[requiredRule('La etiqueta')]"
              :disable="saving"
            />

            <q-input
              v-model="form.code"
              outlined
              dense
              label="Codigo"
              class="soft-input"
              hide-bottom-space
              :rules="[requiredRule('El codigo')]"
              :disable="saving"
            />

            <q-select
              v-model="form.parentId"
              outlined
              dense
              emit-value
              map-options
              label="Menu padre"
              :options="parentOptions"
              class="soft-input"
              hide-bottom-space
              :disable="saving"
            />

            <q-input
              v-model="form.icon"
              outlined
              dense
              label="Icono"
              class="soft-input"
              hide-bottom-space
              :rules="[requiredRule('El icono')]"
              :disable="saving"
            />

            <q-input
              v-model="form.path"
              outlined
              dense
              label="Ruta"
              class="soft-input"
              hide-bottom-space
              :disable="saving"
            />

            <q-input
              v-model="form.routeName"
              outlined
              dense
              label="Nombre de ruta"
              class="soft-input"
              hide-bottom-space
              :disable="saving"
            />

            <q-select
              v-model="form.permissionGroup"
              outlined
              dense
              emit-value
              map-options
              label="Grupo de permiso"
              :options="permissionGroupOptions"
              class="soft-input"
              hide-bottom-space
              :disable="saving"
            />

            <q-select
              v-model="form.permissionScope"
              outlined
              dense
              emit-value
              map-options
              label="Alcance del permiso"
              :options="permissionScopeOptions"
              class="soft-input"
              hide-bottom-space
              :disable="saving"
            />

            <q-input
              v-model="form.permissionName"
              outlined
              dense
              label="Permiso requerido"
              class="soft-input dialog-form-grid__full"
              hide-bottom-space
              :disable="saving"
            />

            <q-input
              v-model.number="form.sortOrder"
              outlined
              dense
              type="number"
              label="Orden"
              class="soft-input"
              hide-bottom-space
              :rules="[requiredRule('El orden'), positiveNumberRule]"
              :disable="saving"
            />

            <div class="menu-dialog__toggle">
              <q-toggle v-model="form.isActive" color="primary" label="Menu activo" :disable="saving" />
              <span>Si esta desactivado no se mostrara en la navegacion.</span>
            </div>
          </div>

          <q-banner rounded class="bg-grey-2 text-grey-8">
            Si la ruta queda vacia, el menu se tratara como grupo visual para organizar sus hijos.
          </q-banner>
        </q-card-section>

        <q-card-actions align="right" class="details-dialog__actions">
          <q-btn flat color="primary" label="Cancelar" no-caps v-close-popup :disable="saving" />
          <q-btn color="primary" icon="save" :label="submitLabel" no-caps :loading="saving" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { QForm } from 'quasar';
import { requiredRule } from '../../../composables/shared/form-rules';
import { normalizeMenuIcon } from '../../../composables/shared/menu-icons';
import type { MenuFormPayload, MenuItem } from '../../../interfaces/menus/menu.interface';

const props = defineProps<{
  modelValue: boolean;
  menu: MenuItem | null;
  saving?: boolean;
  parentOptions: Array<{ label: string; value: number | string | null }>;
  initialParentId?: number | string | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  save: [payload: MenuFormPayload];
}>();

const form = reactive({
  code: '',
  label: '',
  routeName: '',
  path: '',
  icon: '',
  parentId: null as number | string | null,
  sortOrder: 0,
  isActive: true,
  permissionName: '',
  permissionGroup: 'security',
  permissionScope: 'system',
});

const formRef = ref<QForm | null>(null);

const permissionGroupOptions = [
  { label: 'Acceso', value: 'access' },
  { label: 'Condominios', value: 'condominiums' },
  { label: 'Facturacion', value: 'billing' },
  { label: 'Catalogos', value: 'catalogs' },
  { label: 'Seguridad', value: 'security' },
  { label: 'Residente', value: 'resident' },
  { label: 'Directiva', value: 'board' },
  { label: 'General', value: 'general' },
];

const permissionScopeOptions = [
  { label: 'Sistema', value: 'system' },
  { label: 'Condominio', value: 'condominium' },
  { label: 'Residente', value: 'resident' },
];

const dialogTitle = computed(() => (props.menu ? 'Editar menu' : 'Nuevo menu'));
const submitLabel = computed(() => (props.menu ? 'Guardar cambios' : 'Crear menu'));
const saving = computed(() => props.saving === true);
const previewIcon = computed(() => normalizeMenuIcon(form.icon));

const positiveNumberRule = (value: unknown) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return 'El orden debe ser un numero positivo';
  }

  return true;
};

watch(
  () => props.modelValue,
  (visible) => {
    if (!visible) {
      return;
    }

    form.code = props.menu?.code || '';
    form.label = props.menu?.label || '';
    form.routeName = props.menu?.route_name || '';
    form.path = props.menu?.path || '';
    form.icon = props.menu?.icon || '';
    form.parentId = props.menu?.parent_id ?? props.initialParentId ?? null;
    form.sortOrder = props.menu?.sort_order ?? 0;
    form.isActive = props.menu?.is_active ?? true;
    form.permissionName =
      typeof props.menu?.required_permission === 'object' && props.menu?.required_permission !== null
        ? props.menu.required_permission.name || ''
        : '';
    form.permissionGroup =
      typeof props.menu?.required_permission === 'object' && props.menu?.required_permission !== null
        ? props.menu.required_permission.group || 'security'
        : 'security';
    form.permissionScope =
      typeof props.menu?.required_permission === 'object' && props.menu?.required_permission !== null
        ? props.menu.required_permission.scope || 'system'
        : 'system';
  },
  { immediate: true },
);

watch(
  () => props.menu,
  (menu) => {
    if (!props.modelValue) {
      return;
    }

    form.code = menu?.code || '';
    form.label = menu?.label || '';
    form.routeName = menu?.route_name || '';
    form.path = menu?.path || '';
    form.icon = menu?.icon || '';
    form.parentId = menu?.parent_id ?? props.initialParentId ?? null;
    form.sortOrder = menu?.sort_order ?? 0;
    form.isActive = menu?.is_active ?? true;
    form.permissionName =
      typeof menu?.required_permission === 'object' && menu.required_permission !== null
        ? menu.required_permission.name || ''
        : '';
    form.permissionGroup =
      typeof menu?.required_permission === 'object' && menu.required_permission !== null
        ? menu.required_permission.group || 'security'
        : 'security';
    form.permissionScope =
      typeof menu?.required_permission === 'object' && menu.required_permission !== null
        ? menu.required_permission.scope || 'system'
        : 'system';
  },
);

async function emitSave() {
  const isValid = await formRef.value?.validate();

  if (!isValid) {
    return;
  }

  emit('save', {
    code: form.code.trim(),
    label: form.label.trim(),
    route_name: form.routeName.trim(),
    path: form.path.trim(),
    icon: form.icon.trim(),
    parent_id: form.parentId,
    sort_order: Number(form.sortOrder),
    is_active: form.isActive,
    required_permission_name: form.permissionName.trim(),
    required_permission_group: form.permissionGroup,
    required_permission_scope: form.permissionScope,
  });
}
</script>

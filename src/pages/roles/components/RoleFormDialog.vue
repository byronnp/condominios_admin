<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="emit('update:modelValue', $event)">
    <q-card class="details-dialog role-dialog role-dialog--form">
      <q-card-section class="details-dialog__header">
        <div class="details-dialog__identity">
          <q-avatar size="54px" color="primary" text-color="white" icon="admin_panel_settings" />
          <div>
            <h2>{{ dialogTitle }}</h2>
            <span>Define el nombre visible del rol para administracion interna.</span>
          </div>
        </div>

        <q-btn flat round dense icon="close" aria-label="Cerrar dialogo" v-close-popup />
      </q-card-section>

      <q-separator />

      <q-form @submit.prevent="emitSave">
        <q-card-section class="role-dialog__body">
          <div class="role-dialog__helper">
            <q-icon name="tips_and_updates" />
            <p>
              El nombre del rol se usa en la interfaz y en la asignacion de permisos. Mantelo corto y
              descriptivo.
            </p>
          </div>

          <div class="dialog-form-grid">
          <q-input
            v-model="form.name"
            outlined
            dense
            autofocus
            label="Nombre del rol"
            class="soft-input dialog-form-grid__full"
            hide-bottom-space
            :rules="[requiredRule('El nombre del rol')]"
            :disable="saving"
          />
          </div>
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
import { computed, reactive, watch } from 'vue';
import { requiredRule } from '../../../composables/shared/form-rules';
import type { RoleDetails } from '../../../interfaces/roles/role.interface';

const props = defineProps<{
  modelValue: boolean;
  role: RoleDetails | null;
  saving?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  save: [payload: { name: string }];
}>();

const form = reactive({
  name: '',
});

const dialogTitle = computed(() => (props.role ? 'Editar rol' : 'Nuevo rol'));
const submitLabel = computed(() => (props.role ? 'Guardar cambios' : 'Crear rol'));
const saving = computed(() => props.saving === true);

watch(
  () => props.modelValue,
  (visible) => {
    if (!visible) {
      return;
    }

    form.name = props.role?.displayName || props.role?.name || '';
  },
  { immediate: true },
);

watch(
  () => props.role,
  (role) => {
    if (!props.modelValue) {
      return;
    }

    form.name = role?.displayName || role?.name || '';
  },
);

function emitSave() {
  emit('save', { name: form.name.trim() });
}
</script>

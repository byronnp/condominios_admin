<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="emit('update:modelValue', $event)">
    <q-card class="details-dialog role-dialog role-dialog--form">
      <q-card-section class="details-dialog__header">
        <div class="details-dialog__identity">
          <q-avatar size="54px" color="primary" text-color="white" icon="admin_panel_settings" />
          <div>
            <h2>{{ dialogTitle }}</h2>
            <span>Define el alcance y la asignacion del rol antes de guardar.</span>
          </div>
        </div>

        <q-btn flat round dense icon="close" aria-label="Cerrar dialogo" v-close-popup />
      </q-card-section>

      <q-separator />

      <q-form ref="formRef" @submit.prevent="emitSave">
        <q-card-section class="role-dialog__body">
          <div class="role-dialog__helper">
            <q-icon name="tips_and_updates" />
            <p>
              Para roles de condominio selecciona el condominio destino. Los permisos se guardan por alcance
              y luego puedes ajustarlos con la vista de permisos agrupados.
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

            <q-select
              v-model="form.scope"
              outlined
              dense
              hide-bottom-space
              emit-value
              map-options
              label="Alcance"
              :options="scopeOptions"
              :rules="[requiredRule('Selecciona el alcance')]"
              class="soft-input"
              :disable="saving"
            />

            <q-select
              v-if="form.scope === 'condominium'"
              v-model="form.condominiumId"
              outlined
              dense
              hide-bottom-space
              emit-value
              map-options
              label="Condominio"
              :options="condominiumOptions"
              :loading="condominiumsLoading"
              :rules="[requiredRule('Selecciona el condominio')]"
              class="soft-input"
              :disable="saving"
            />

            <q-input
              v-model="form.description"
              outlined
              dense
              type="textarea"
              autogrow
              label="Descripcion"
              class="soft-input dialog-form-grid__full"
              hide-bottom-space
              :disable="saving"
            />
          </div>

          <q-banner v-if="form.scope === 'condominium'" rounded class="bg-blue-1 text-primary q-mt-sm">
            Este rol quedara visible solo para {{ selectedCondominiumName }}.
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
import type { RoleDetails } from '../../../interfaces/roles/role.interface';
import type { RoleFormPayload } from '../../../interfaces/roles/role-form.interface';

const props = defineProps<{
  modelValue: boolean;
  role: RoleDetails | null;
  saving?: boolean;
  condominiums: Array<{ label: string; value: number | string }>;
  condominiumsLoading?: boolean;
  initialScope?: string;
  initialCondominiumId?: number | string | null;
  initialCondominiumName?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  save: [payload: RoleFormPayload];
}>();

const form = reactive({
  name: '',
  scope: 'system',
  condominiumId: null as number | string | null,
  description: '',
});

const formRef = ref<QForm | null>(null);

const scopeOptions = [
  { label: 'Sistema', value: 'system' },
  { label: 'Condominio', value: 'condominium' },
];

const dialogTitle = computed(() => (props.role ? 'Editar rol' : 'Nuevo rol'));
const submitLabel = computed(() => (props.role ? 'Guardar cambios' : 'Crear rol'));
const saving = computed(() => props.saving === true);
const condominiumOptions = computed(() => props.condominiums);
const selectedCondominiumName = computed(() => props.initialCondominiumName || 'el condominio seleccionado');

watch(
  () => props.modelValue,
  (visible) => {
    if (!visible) {
      return;
    }

    form.name = props.role?.displayName || props.role?.name || '';
    form.scope = props.role?.scope || props.initialScope || 'system';
    form.condominiumId = props.role?.condominiumId ?? props.initialCondominiumId ?? null;
    form.description = props.role?.description || '';
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
    form.scope = role?.scope || props.initialScope || 'system';
    form.condominiumId = role?.condominiumId ?? props.initialCondominiumId ?? null;
    form.description = role?.description || '';
  },
);

watch(
  () => form.scope,
  (scope) => {
    if (scope === 'system') {
      form.condominiumId = null;
    }
  },
);

async function emitSave() {
  const isValid = await formRef.value?.validate();

  if (!isValid) {
    return;
  }

  emit('save', {
    name: form.name.trim(),
    scope: form.scope,
    condominium_id: form.scope === 'condominium' ? form.condominiumId : null,
    description: form.description.trim(),
  });
}
</script>

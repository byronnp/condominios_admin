<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="general-dialog condominium-directive-dialog">
      <q-card-section class="general-dialog__header">
        <div class="general-dialog__identity">
          <q-avatar color="primary" text-color="white" size="42px">
            <q-icon name="event" />
          </q-avatar>
          <div>
            <h2>{{ mode === 'edit' ? 'Editar gestion' : 'Nueva gestion' }}</h2>
            <span>Define el periodo de trabajo de la directiva del condominio.</span>
          </div>
        </div>

        <q-btn flat round dense icon="close" aria-label="Cerrar" v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section class="condominium-directive-dialog__body">
        <q-banner v-if="error" rounded class="bg-red-1 text-negative">
          {{ error }}
        </q-banner>

        <q-form ref="formRef" class="condominium-directive-dialog__form" @submit.prevent="handleSubmit">
          <div class="dialog-form-grid">
            <q-input
              v-model="form.title"
              outlined
              dense
              hide-bottom-space
              label="Titulo de la gestion"
              :rules="[requiredRule('Ingresa el titulo')]"
              class="soft-input dialog-form-grid__full"
            />

            <q-input
              v-model="form.periodStart"
              outlined
              dense
              hide-bottom-space
              type="date"
              label="Fecha inicio"
              :rules="[requiredRule('Selecciona la fecha de inicio')]"
              class="soft-input"
            />

            <q-input
              v-model="form.periodEnd"
              outlined
              dense
              hide-bottom-space
              type="date"
              label="Fecha fin"
              :rules="[endDateRule]"
              class="soft-input"
            />

            <q-select
              v-model="form.status"
              outlined
              dense
              hide-bottom-space
              emit-value
              map-options
              label="Estado"
              :options="statusOptions"
              :rules="[requiredRule('Selecciona el estado')]"
              class="soft-input"
            />

            <q-input
              v-model="form.notes"
              outlined
              dense
              hide-bottom-space
              type="textarea"
              autogrow
              label="Observacion"
              class="soft-input dialog-form-grid__full"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="general-dialog__actions">
        <q-btn flat color="primary" label="Cancelar" no-caps v-close-popup />
        <q-btn color="primary" icon="save" label="Guardar gestion" no-caps :loading="loading" @click="handleSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import type { QForm } from 'quasar';
import type {
  CondominiumDirectivePeriod,
  CondominiumDirectivePeriodForm,
  CondominiumDirectiveStatus,
} from '../../../interfaces/condominiums/condominium-directive.interface';
import { requiredRule } from '../../../composables/shared/form-rules';

const props = defineProps<{
  modelValue: boolean;
  mode: 'create' | 'edit';
  loading: boolean;
  error: string;
  period: CondominiumDirectivePeriod | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  submit: [value: CondominiumDirectivePeriodForm];
}>();

const statusOptions: Array<{ label: string; value: CondominiumDirectiveStatus }> = [
  { label: 'Vigente', value: 'vigente' },
  { label: 'Historica', value: 'histórica' },
  { label: 'Pendiente', value: 'pendiente' },
];

const form = reactive<CondominiumDirectivePeriodForm>({
  title: '',
  periodStart: '',
  periodEnd: '',
  status: 'vigente',
  notes: '',
});

const formRef = ref<QForm | null>(null);

const endDateRule = (value: string) => {
  if (!value) {
    return true;
  }

  if (!form.periodStart) {
    return 'Selecciona la fecha de inicio primero';
  }

  return value >= form.periodStart || 'La fecha fin debe ser igual o mayor a la fecha inicio';
};

watch(
  () => props.modelValue,
  (visible) => {
    if (!visible) {
      return;
    }

    if (props.period) {
      form.title = props.period.title;
      form.periodStart = props.period.periodStart;
      form.periodEnd = props.period.periodEnd;
      form.status = props.period.status;
      form.notes = props.period.notes;
      return;
    }

    form.title = '';
    form.periodStart = '';
    form.periodEnd = '';
    form.status = 'vigente';
    form.notes = '';
  },
  { immediate: true },
);

async function handleSubmit() {
  const isValid = await formRef.value?.validate();

  if (!isValid) {
    return;
  }

  emit('submit', {
    title: form.title.trim(),
    periodStart: form.periodStart,
    periodEnd: form.periodEnd,
    status: form.status,
    notes: form.notes.trim(),
  });
}
</script>

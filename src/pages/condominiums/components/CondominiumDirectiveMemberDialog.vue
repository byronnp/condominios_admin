<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="general-dialog condominium-directive-dialog">
      <q-card-section class="general-dialog__header">
        <div class="general-dialog__identity">
          <q-avatar color="primary" text-color="white" size="42px">
            <q-icon :name="form.memberType === 'resident' ? 'groups' : 'work'" />
          </q-avatar>
          <div>
            <h2>{{ mode === 'edit' ? 'Editar miembro de directiva' : 'Nuevo miembro de directiva' }}</h2>
            <span>Registra residentes y miembros externos por cargo.</span>
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
            <q-select
              v-model="form.memberType"
              outlined
              dense
              hide-bottom-space
              emit-value
              map-options
              label="Tipo de miembro"
              :options="memberTypeOptions"
              :rules="[requiredRule('Selecciona el tipo de miembro')]"
              class="soft-input"
            />

            <q-select
              v-model="form.role"
              outlined
              dense
              hide-bottom-space
              emit-value
              map-options
              label="Cargo"
              :options="roleOptions"
              :rules="[requiredRule('Selecciona el cargo')]"
              class="soft-input"
            />

            <q-select
              v-if="form.memberType === 'resident'"
              v-model="form.residentId"
              outlined
              dense
              hide-bottom-space
              emit-value
              map-options
              label="Residente"
              :options="residentOptions"
              :rules="[requiredRule('Selecciona un residente')]"
              class="soft-input dialog-form-grid__full"
            />

            <q-input
              v-if="form.memberType === 'external'"
              v-model="form.fullName"
              outlined
              dense
              hide-bottom-space
              label="Nombre completo"
              :rules="[requiredRule('Ingresa el nombre completo')]"
              class="soft-input dialog-form-grid__full"
            />

            <q-input
              v-if="form.memberType === 'external'"
              v-model="form.document"
              outlined
              dense
              hide-bottom-space
              label="Identificación"
              :rules="[requiredRule('Ingresa la identificación')]"
              class="soft-input"
            />

            <q-input
              v-if="form.memberType === 'external'"
              v-model="form.company"
              outlined
              dense
              hide-bottom-space
              label="Empresa / actividad"
              :rules="[requiredRule('Indica la empresa o actividad')]"
              class="soft-input"
            />

            <q-input
              v-if="form.memberType === 'external'"
              v-model="form.email"
              outlined
              dense
              hide-bottom-space
              type="email"
              label="Correo"
              :rules="[requiredRule('Ingresa el correo'), emailRule]"
              class="soft-input"
            />

            <q-input
              v-if="form.memberType === 'external'"
              v-model="form.phone"
              outlined
              dense
              hide-bottom-space
              label="Teléfono"
              :rules="[requiredRule('Ingresa el teléfono')]"
              class="soft-input"
            />

            <q-input
              v-model="form.periodStart"
              outlined
              dense
              hide-bottom-space
              type="date"
              label="Inicio del periodo"
              :rules="[requiredRule('Selecciona la fecha de inicio')]"
              class="soft-input"
            />

            <q-input
              v-model="form.periodEnd"
              outlined
              dense
              hide-bottom-space
              type="date"
              label="Fin del periodo"
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
              label="Observación"
              class="soft-input dialog-form-grid__full"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="general-dialog__actions">
        <q-btn flat color="primary" label="Cancelar" no-caps v-close-popup />
        <q-btn color="primary" icon="save" label="Guardar miembro" no-caps :loading="loading" @click="handleSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { QForm } from 'quasar';
import type {
  CondominiumDirectiveForm,
  CondominiumDirectiveMember,
  CondominiumDirectiveMemberType,
  CondominiumDirectiveStatus,
} from '../../../interfaces/condominiums/condominium-directive.interface';
import { requiredRule, emailRule } from '../../../composables/shared/form-rules';

const props = defineProps<{
  modelValue: boolean;
  mode: 'create' | 'edit';
  loading: boolean;
  error: string;
  member: CondominiumDirectiveMember | null;
  residentOptions: Array<{ label: string; value: number }>;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  submit: [value: CondominiumDirectiveForm];
}>();

const memberTypeOptions: Array<{ label: string; value: CondominiumDirectiveMemberType }> = [
  { label: 'Residente', value: 'resident' },
  { label: 'Externo', value: 'external' },
];

const roleOptions = [
  { label: 'Presidente', value: 'presidente' },
  { label: 'Vicepresidente', value: 'vicepresidente' },
  { label: 'Secretario', value: 'secretario' },
  { label: 'Tesorero', value: 'tesorero' },
  { label: 'Vocal', value: 'vocal' },
  { label: 'Contadora', value: 'contadora' },
];

const statusOptions: Array<{ label: string; value: CondominiumDirectiveStatus }> = [
  { label: 'Vigente', value: 'vigente' },
  { label: 'Historica', value: 'histórica' },
  { label: 'Pendiente', value: 'pendiente' },
];

const form = reactive<CondominiumDirectiveForm>({
  memberType: 'resident',
  role: '',
  residentId: null,
  fullName: '',
  document: '',
  email: '',
  phone: '',
  company: '',
  periodStart: '',
  periodEnd: '',
  status: 'vigente',
  notes: '',
});

const formRef = ref<QForm | null>(null);
const residentField = computed(() =>
  props.residentOptions.find((option) => option.value === form.residentId) || null,
);

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

    if (props.member) {
      form.memberType = props.member.memberType;
      form.role = props.member.role;
      form.residentId = props.member.memberType === 'resident' ? props.member.residentId || null : null;
      form.fullName = props.member.fullName;
      form.document = props.member.document;
      form.email = props.member.email;
      form.phone = props.member.phone;
      form.company = props.member.memberType === 'external' ? props.member.notes || 'Externo' : '';
      form.periodStart = props.member.periodStart;
      form.periodEnd = props.member.periodEnd;
      form.status = props.member.status;
      form.notes = props.member.notes;
      return;
    }

    form.memberType = 'resident';
    form.role = '';
    form.residentId = null;
    form.fullName = '';
    form.document = '';
    form.email = '';
    form.phone = '';
    form.company = '';
    form.periodStart = '';
    form.periodEnd = '';
    form.status = 'vigente';
    form.notes = '';
  },
  { immediate: true },
);

watch(
  () => form.memberType,
  (memberType) => {
    if (memberType === 'resident') {
      form.fullName = '';
      form.document = '';
      form.email = '';
      form.phone = '';
      form.company = '';
    } else {
      form.residentId = null;
    }
  },
);

async function handleSubmit() {
  const isValid = await formRef.value?.validate();

  if (!isValid) {
    return;
  }

  const payload: CondominiumDirectiveForm = {
    memberType: form.memberType,
    role: form.role,
    residentId: form.residentId,
    fullName: form.memberType === 'resident' ? residentField.value?.label || '' : form.fullName.trim(),
    document: form.document.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    company: form.company.trim(),
    periodStart: form.periodStart,
    periodEnd: form.periodEnd,
    status: form.status,
    notes: form.notes.trim(),
  };

  emit('submit', payload);
}
</script>

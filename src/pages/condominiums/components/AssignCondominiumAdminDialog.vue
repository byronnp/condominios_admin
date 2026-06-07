<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="details-dialog">
      <q-card-section class="details-dialog__header">
        <div class="details-dialog__identity">
          <div>
            <h2>{{ dialogTitle }}</h2>
            <span>{{ condominium?.name || 'Selecciona un condominio' }}</span>
          </div>
        </div>

        <div class="details-dialog__header-actions">
          <q-btn flat round dense icon="close" aria-label="Cerrar" :disable="loading" v-close-popup />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-banner v-if="error" rounded class="bg-red-1 text-negative q-mb-md">
          {{ error }}
        </q-banner>

        <q-banner v-if="permissionsWarning" rounded class="bg-amber-1 text-warning q-mb-md">
          {{ permissionsWarning }}
        </q-banner>

        <q-form ref="formRef" class="dialog-form-grid" @submit.prevent="submitForm">
          <q-input
            v-model="form.first_name"
            outlined
            dense
            hide-bottom-space
            label="Nombres"
            class="soft-input"
            :rules="[requiredRule('Los nombres')]"
          />
          <q-input
            v-model="form.last_name"
            outlined
            dense
            hide-bottom-space
            label="Apellidos"
            class="soft-input"
            :rules="[requiredRule('Los apellidos')]"
          />
          <q-select
            v-model="form.identification_type_id"
            outlined
            dense
            :options="identificationTypeOptions"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            label="Tipo de identificacion"
            class="soft-input"
            hide-bottom-space
            :rules="[requiredRule('El tipo de identificacion')]"
            :loading="identificationTypesLoading"
            :disable="loading || identificationTypesLoading"
          />
          <q-input
            v-model="form.identification_number"
            outlined
            dense
            hide-bottom-space
            label="Numero de identificacion"
            class="soft-input"
            :rules="[requiredRule('El numero de identificacion')]"
          />
          <q-input
            v-model="form.mobile_phone"
            outlined
            dense
            hide-bottom-space
            label="Celular"
            class="soft-input"
            :rules="[requiredRule('El celular')]"
          />
          <q-input
            v-model="form.landline_phone"
            outlined
            dense
            hide-bottom-space
            label="Telefono convencional"
            class="soft-input"
          />
          <q-input
            v-model="form.email"
            outlined
            dense
            hide-bottom-space
            type="email"
            label="Correo"
            class="soft-input"
            :rules="[requiredRule('El correo'), emailRule]"
          />
          <q-input
            v-model="form.password"
            outlined
            dense
            hide-bottom-space
            type="password"
            :label="passwordLabel"
            class="soft-input"
            :rules="[passwordRule]"
          />
          <q-input
            v-model="form.password_confirmation"
            outlined
            dense
            hide-bottom-space
            type="password"
            :label="passwordConfirmationLabel"
            class="soft-input"
            :rules="[passwordConfirmationRule]"
          />

          <div class="dialog-form-grid__full permission-grid">
            <q-checkbox v-model="form.can_manage_houses" dense label="Gestionar casas" />
            <q-checkbox v-model="form.can_manage_residents" dense label="Gestionar residentes" />
            <q-checkbox v-model="form.can_manage_fees" dense label="Gestionar alicuotas" />
            <q-checkbox v-model="form.can_manage_payments" dense label="Gestionar pagos" />
            <q-checkbox v-model="form.can_manage_invitations" dense label="Gestionar invitaciones" />
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="details-dialog__actions">
        <q-btn flat color="primary" label="Cancelar" no-caps :disable="loading" v-close-popup />
        <q-btn
          color="primary"
          :icon="submitIcon"
          :label="submitLabel"
          no-caps
          :loading="loading"
          :disable="!canSubmit"
          @click="submitForm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { emailRule, minLengthRule, requiredRule, confirmedRule } from '../../../composables/shared/form-rules';
import { useCatalog } from '../../../composables/catalogs/useCatalog';
import type {
  CreateCondominiumAdminPayload,
  UpdateCondominiumAdminPayload,
} from '../../../interfaces/administrators/administrator-form.interface';
import type { CondominiumAdmin } from '../../../interfaces/administrators/administrator.interface';
import type { CondominiumDetails } from '../../../interfaces/condominiums/condominium.interface';

type CondominiumAdminForm = Omit<UpdateCondominiumAdminPayload, 'identification_type_id'> & {
  identification_type_id: number | string | null;
  password: string;
  password_confirmation: string;
};

const props = defineProps<{
  modelValue: boolean;
  condominium: CondominiumDetails | null;
  admin?: CondominiumAdmin | null;
  mode?: 'create' | 'edit';
  loading: boolean;
  error: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  submit: [payload: CreateCondominiumAdminPayload | UpdateCondominiumAdminPayload];
}>();

const {
  items: identificationTypeItems,
  loading: identificationTypesLoading,
  loadCatalog: loadIdentificationTypes,
} = useCatalog('1');

const form = reactive<CondominiumAdminForm>({
  first_name: '',
  last_name: '',
  identification_type_id: null,
  identification_number: '',
  mobile_phone: '',
  landline_phone: '',
  email: '',
  password: '',
  password_confirmation: '',
  can_manage_houses: false,
  can_manage_residents: false,
  can_manage_fees: false,
  can_manage_payments: false,
  can_manage_invitations: false,
});
const formRef = ref<{ validate: () => Promise<boolean> | boolean } | null>(null);

const isEditMode = computed(() => props.mode === 'edit');
const dialogTitle = computed(() => (isEditMode.value ? 'Editar administrador' : 'Agregar administrador'));
const submitIcon = computed(() => (isEditMode.value ? 'save' : 'person_add'));
const submitLabel = computed(() => (isEditMode.value ? 'Guardar' : 'Agregar'));
const passwordLabel = computed(() => (isEditMode.value ? 'Nueva contrasena' : 'Contrasena'));
const passwordConfirmationLabel = computed(() =>
  isEditMode.value ? 'Confirmar nueva contrasena' : 'Confirmar contrasena',
);
const passwordRule = (value: string) => {
  if (!isEditMode.value) {
    const requiredCheck = requiredRule('La contrasena')(value);
    return requiredCheck === true ? minLengthRule(8, 'La contrasena')(value) : requiredCheck;
  }

  if (!hasPasswordChange.value && !value) {
    return true;
  }

  const requiredCheck = requiredRule('La nueva contrasena')(value);
  return requiredCheck === true ? minLengthRule(8, 'La nueva contrasena')(value) : requiredCheck;
};
const passwordConfirmationRule = (value: string) => {
  if (!isEditMode.value) {
    return confirmedRule(form.password, value);
  }

  if (!hasPasswordChange.value && !value) {
    return true;
  }

  return confirmedRule(form.password, value);
};
const permissionsWarning = computed(() =>
  isEditMode.value && props.admin && !props.admin.hasPermissionData
    ? 'El API no envio permisos para este administrador. No guardes cambios hasta cargar esa informacion desde el backend.'
    : '',
);
const identificationTypeOptions = computed(() =>
  identificationTypeItems.value.map((item) => ({
    value: Number(item.id),
    label: item.name,
  })),
);
const hasPasswordChange = computed(() => Boolean(form.password || form.password_confirmation));
const passwordsMatch = computed(() => form.password === form.password_confirmation);
const canSubmit = computed(
  () =>
    Boolean(props.condominium) &&
    Boolean(form.first_name.trim()) &&
    Boolean(form.last_name.trim()) &&
    Boolean(form.identification_type_id) &&
    Boolean(form.identification_number.trim()) &&
    Boolean(form.mobile_phone.trim()) &&
    Boolean(form.email.trim()) &&
    !permissionsWarning.value &&
    (isEditMode.value
      ? !hasPasswordChange.value || (Boolean(form.password) && passwordsMatch.value)
      : Boolean(form.password) && Boolean(form.password_confirmation) && passwordsMatch.value) &&
    !props.loading,
);

function resetForm() {
  Object.assign(form, {
    first_name: '',
    last_name: '',
    identification_type_id: null,
    identification_number: '',
    mobile_phone: '',
    landline_phone: '',
    email: '',
    password: '',
    password_confirmation: '',
    can_manage_houses: false,
    can_manage_residents: false,
    can_manage_fees: false,
    can_manage_payments: false,
    can_manage_invitations: false,
  });
}

function assignForm(admin: CondominiumAdmin) {
  if (!admin.hasPermissionData) {
    console.warn('El administrador no trae permisos desde el API; no se pueden marcar los checkboxes.', admin);
  }

  Object.assign(form, {
    first_name: admin.firstName,
    last_name: admin.lastName,
    identification_type_id: admin.identificationTypeId,
    identification_number: admin.identificationNumber === 'Sin identificacion' ? '' : admin.identificationNumber,
    mobile_phone: admin.phone === 'Sin telefono' ? '' : admin.phone,
    landline_phone: admin.landlinePhone,
    email: admin.email === 'Sin correo' ? '' : admin.email,
    password: '',
    password_confirmation: '',
    can_manage_houses: admin.canManageHouses,
    can_manage_residents: admin.canManageResidents,
    can_manage_fees: admin.canManageFees,
    can_manage_payments: admin.canManagePayments,
    can_manage_invitations: admin.canManageInvitations,
  });
}

async function submitForm() {
  const isValid = await formRef.value?.validate();

  if (isValid === false) {
    return;
  }

  const payload: UpdateCondominiumAdminPayload = {
    first_name: form.first_name.trim(),
    last_name: form.last_name.trim(),
    identification_type_id: Number(form.identification_type_id),
    identification_number: form.identification_number.trim(),
    mobile_phone: form.mobile_phone.trim(),
    landline_phone: form.landline_phone.trim(),
    email: form.email.trim(),
    can_manage_houses: form.can_manage_houses,
    can_manage_residents: form.can_manage_residents,
    can_manage_fees: form.can_manage_fees,
    can_manage_payments: form.can_manage_payments,
    can_manage_invitations: form.can_manage_invitations,
  };

  if (!isEditMode.value || hasPasswordChange.value) {
    payload.password = form.password;
    payload.password_confirmation = form.password_confirmation;
  }

  emit('submit', payload);
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      if (isEditMode.value && props.admin) {
        assignForm(props.admin);
      } else {
        resetForm();
      }
      void loadIdentificationTypes();
    }
  },
);
</script>

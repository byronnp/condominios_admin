<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Editar administrador</p>
        <h1>{{ fullName || 'Administrador' }}</h1>
      </div>
      <div class="heading-actions">
        <q-btn
          outline
          color="primary"
          icon="arrow_back"
          label="Volver"
          to="/admin/condominios"
          no-caps
        />
      </div>
    </section>

    <section class="panel form-panel">
      <div class="panel-header">
        <div>
          <h2>Editar administrador</h2>
          <p>{{ fullName || 'Administrador seleccionado' }}</p>
        </div>
      </div>

      <q-banner v-if="error" rounded class="bg-red-1 text-negative q-mb-md">
        {{ error }}
      </q-banner>

      <q-banner v-if="saved" rounded class="bg-green-1 text-positive q-mb-md">
        Administrador actualizado correctamente.
      </q-banner>

      <q-form class="dialog-form-grid" @submit.prevent="submitForm">
        <q-input
          v-model="form.first_name"
          outlined
          dense
          label="Nombres"
          class="soft-input"
          :disable="loading || saving"
        />
        <q-input
          v-model="form.last_name"
          outlined
          dense
          label="Apellidos"
          class="soft-input"
          :disable="loading || saving"
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
          :loading="identificationTypesLoading"
          :disable="loading || saving || identificationTypesLoading"
        />
        <q-input
          v-model="form.identification_number"
          outlined
          dense
          label="Numero de identificacion"
          class="soft-input"
          :disable="loading || saving"
        />
        <q-input
          v-model="form.mobile_phone"
          outlined
          dense
          label="Celular"
          class="soft-input"
          :disable="loading || saving"
        />
        <q-input
          v-model="form.landline_phone"
          outlined
          dense
          label="Telefono convencional"
          class="soft-input"
          :disable="loading || saving"
        />
        <q-input
          v-model="form.email"
          outlined
          dense
          type="email"
          label="Correo"
          class="soft-input"
          :disable="loading || saving"
        />
        <q-input
          v-model="form.password"
          outlined
          dense
          type="password"
          label="Contrasena"
          class="soft-input"
          :disable="loading || saving"
        />
        <q-input
          v-model="form.password_confirmation"
          outlined
          dense
          type="password"
          label="Confirmar contrasena"
          class="soft-input"
          :disable="loading || saving"
        />

        <div class="dialog-form-grid__full permission-grid">
          <q-checkbox
            v-model="form.can_manage_houses"
            dense
            label="Gestionar casas"
            :disable="loading || saving"
          />
          <q-checkbox
            v-model="form.can_manage_residents"
            dense
            label="Gestionar residentes"
            :disable="loading || saving"
          />
          <q-checkbox
            v-model="form.can_manage_fees"
            dense
            label="Gestionar alicuotas"
            :disable="loading || saving"
          />
          <q-checkbox
            v-model="form.can_manage_payments"
            dense
            label="Gestionar pagos"
            :disable="loading || saving"
          />
          <q-checkbox
            v-model="form.can_manage_invitations"
            dense
            label="Gestionar invitaciones"
            :disable="loading || saving"
          />
        </div>
      </q-form>

      <q-card-actions align="right" class="details-dialog__actions">
        <q-btn
          flat
          color="primary"
          label="Cancelar"
          no-caps
          :disable="saving"
          to="/admin/condominios"
        />
        <q-btn
          color="primary"
          icon="save"
          label="Guardar"
          no-caps
          :loading="saving"
          :disable="!canSubmit"
          @click="submitForm"
        />
      </q-card-actions>

      <q-inner-loading :showing="loading">
        <q-spinner color="primary" size="32px" />
      </q-inner-loading>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useCatalog } from '../composables/useCatalog';
import type { UpdateCondominiumAdminPayload } from '../interfaces/administrators/administrator-form.interface';
import type { CondominiumAdminResponse } from '../interfaces/administrators/administrator.interface';
import { getCondominiumAdminById, updateCondominiumAdmin } from '../services/condominiums.service';

type AdministratorEditForm = Omit<UpdateCondominiumAdminPayload, 'identification_type_id'> & {
  identification_type_id: number | string | null;
  password: string;
  password_confirmation: string;
};

const route = useRoute();
const loading = ref(false);
const saving = ref(false);
const error = ref('');
const saved = ref(false);

const {
  items: identificationTypeItems,
  loading: identificationTypesLoading,
  loadCatalog: loadIdentificationTypes,
} = useCatalog('1');

const form = reactive<AdministratorEditForm>({
  first_name: '',
  last_name: '',
  identification_type_id: null,
  identification_number: '',
  mobile_phone: '',
  landline_phone: '',
  email: '',
  can_manage_houses: false,
  can_manage_residents: false,
  can_manage_fees: false,
  can_manage_payments: false,
  can_manage_invitations: false,
  password: '',
  password_confirmation: '',
});

const condominiumId = computed(() => {
  const queryValue = route.query.condominium_id;
  return Array.isArray(queryValue) ? queryValue[0] : queryValue;
});
const adminId = computed(() => String(route.params.id || ''));
const fullName = computed(() => [form.first_name, form.last_name].filter(Boolean).join(' '));
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
    Boolean(condominiumId.value) &&
    Boolean(adminId.value) &&
    Boolean(form.first_name.trim()) &&
    Boolean(form.last_name.trim()) &&
    Boolean(form.identification_type_id) &&
    Boolean(form.identification_number.trim()) &&
    Boolean(form.mobile_phone.trim()) &&
    Boolean(form.email.trim()) &&
    (!hasPasswordChange.value || (Boolean(form.password) && passwordsMatch.value)) &&
    !loading.value &&
    !saving.value,
);

function assignForm(admin: CondominiumAdminResponse) {
  const permissionFlags = getPermissionFlags(admin);

  form.first_name = admin.first_name || '';
  form.last_name = admin.last_name || '';
  form.identification_type_id = normalizeIdentificationTypeId(admin);
  form.identification_number = admin.identification_number || '';
  form.mobile_phone = admin.mobile_phone || admin.phone || '';
  form.landline_phone = admin.landline_phone || '';
  form.email = admin.email || '';
  form.can_manage_houses = permissionFlags.canManageHouses;
  form.can_manage_residents = permissionFlags.canManageResidents;
  form.can_manage_fees = permissionFlags.canManageFees;
  form.can_manage_payments = permissionFlags.canManagePayments;
  form.can_manage_invitations = permissionFlags.canManageInvitations;
  form.password = '';
  form.password_confirmation = '';
}

function normalizeIdentificationTypeId(admin: CondominiumAdminResponse) {
  const value = admin.identification_type?.id ?? admin.identification_type_id;

  if (value === undefined || value === null || value === '') {
    return null;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : value;
}

function normalizePermissionText(value: unknown) {
  if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
    return '';
  }

  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .toLowerCase()
    .trim();
}

function compactPermissionText(value: string) {
  return value.replace(/\s+/g, '');
}

function getPermissionTokens(permissions: CondominiumAdminResponse['permissions']) {
  if (!permissions) {
    return [];
  }

  if (Array.isArray(permissions)) {
    return permissions.flatMap((permission) => {
      if (typeof permission === 'string') {
        return [normalizePermissionText(permission)];
      }

      return [permission.key, permission.code, permission.slug, permission.name]
        .filter((value): value is string => Boolean(value))
        .map(normalizePermissionText);
    });
  }

  return Object.entries(permissions).flatMap(([key, value]) => {
    if (value === false || value === null || value === undefined || value === '') {
      return [];
    }

    return [key, value].map(normalizePermissionText);
  });
}

function hasPermission(
  admin: CondominiumAdminResponse,
  field: keyof Pick<
    CondominiumAdminResponse,
    | 'can_manage_houses'
    | 'can_manage_residents'
    | 'can_manage_fees'
    | 'can_manage_payments'
    | 'can_manage_invitations'
  >,
  aliases: string[],
) {
  if (admin[field] === true) {
    return true;
  }

  const normalizedAliases = aliases.map(normalizePermissionText);
  const tokens = getPermissionTokens(admin.permissions);
  const compactAliases = normalizedAliases.map(compactPermissionText);

  return tokens.some((token) => {
    const compactToken = compactPermissionText(token);

    return (
      normalizedAliases.includes(token) ||
      compactAliases.includes(compactToken) ||
      normalizedAliases.some((alias) => token.includes(alias) || alias.includes(token)) ||
      compactAliases.some((alias) => compactToken.includes(alias) || alias.includes(compactToken))
    );
  });
}

function getPermissionFlags(admin: CondominiumAdminResponse) {
  return {
    canManageHouses: hasPermission(admin, 'can_manage_houses', [
      'can_manage_houses',
      'manage_houses',
      'houses',
      'casas',
      'gestionar casas',
      'gestion casas',
      'gestion de casas',
      'administrar casas',
      'viviendas',
      'gestionar viviendas',
    ]),
    canManageResidents: hasPermission(admin, 'can_manage_residents', [
      'can_manage_residents',
      'manage_residents',
      'residents',
      'residentes',
      'gestionar residentes',
      'gestion residentes',
      'gestion de residentes',
      'administrar residentes',
    ]),
    canManageFees: hasPermission(admin, 'can_manage_fees', [
      'can_manage_fees',
      'manage_fees',
      'fees',
      'alicuotas',
      'gestionar alicuotas',
      'gestion alicuotas',
      'gestion de alicuotas',
      'administrar alicuotas',
      'cuotas',
      'gestionar cuotas',
    ]),
    canManagePayments: hasPermission(admin, 'can_manage_payments', [
      'can_manage_payments',
      'manage_payments',
      'payments',
      'pagos',
      'gestionar pagos',
      'gestion pagos',
      'gestion de pagos',
      'administrar pagos',
    ]),
    canManageInvitations: hasPermission(admin, 'can_manage_invitations', [
      'can_manage_invitations',
      'manage_invitations',
      'invitations',
      'invitaciones',
      'gestionar invitaciones',
      'gestion invitaciones',
      'gestion de invitaciones',
      'administrar invitaciones',
    ]),
  };
}

async function loadAdmin() {
  if (!condominiumId.value) {
    error.value = 'No se encontro el condominio del administrador seleccionado.';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    await loadIdentificationTypes();
    const admin = await getCondominiumAdminById(condominiumId.value, adminId.value);

    if (!admin) {
      error.value = 'No se encontro el administrador seleccionado.';
      return;
    }

    assignForm(admin);
  } catch (exception) {
    error.value =
      exception instanceof Error ? exception.message : 'No se pudo cargar el administrador';
  } finally {
    loading.value = false;
  }
}

function buildPayload(): UpdateCondominiumAdminPayload {
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

  if (hasPasswordChange.value) {
    payload.password = form.password;
    payload.password_confirmation = form.password_confirmation;
  }

  return payload;
}

async function submitForm() {
  saved.value = false;

  if (hasPasswordChange.value && !passwordsMatch.value) {
    error.value = 'La confirmacion de contrasena no coincide.';
    return;
  }

  if (!canSubmit.value || !condominiumId.value) {
    return;
  }

  saving.value = true;
  error.value = '';

  try {
    await updateCondominiumAdmin(condominiumId.value, adminId.value, buildPayload());
    form.password = '';
    form.password_confirmation = '';
    saved.value = true;
  } catch (exception) {
    error.value =
      exception instanceof Error ? exception.message : 'No se pudo actualizar el administrador';
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  void loadAdmin();
});
</script>

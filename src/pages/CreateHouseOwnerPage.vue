<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Nuevo residente</p>
        <h1>Crear residente y asignarlo a una casa</h1>
        <p>Registra los datos del residente y vincula la vivienda en un solo paso.</p>
      </div>

      <div class="heading-actions">
        <q-btn
          outline
          color="primary"
          icon="arrow_back"
          label="Volver"
          to="/admin/houses"
          no-caps
        />
        <q-btn
          color="primary"
          icon="save"
          label="Guardar residente"
          no-caps
          :loading="creatingResident"
          :disable="creatingResident"
          @click="submitForm"
        />
      </div>
    </section>

    <q-banner v-if="successMessage" rounded class="bg-green-1 text-positive q-mb-md">
      {{ successMessage }}
    </q-banner>

    <q-banner v-if="pageError" rounded class="bg-red-1 text-negative q-mb-md">
      {{ pageError }}
      <template #action>
        <q-btn flat color="negative" label="Reintentar" no-caps @click="loadPage" />
      </template>
    </q-banner>

    <q-banner
      v-if="!houseOptions.length && !housesLoading"
      rounded
      class="bg-grey-2 text-grey-8 q-mb-md"
    >
      No hay casas disponibles para seleccionar.
    </q-banner>

    <q-form ref="residentFormRef" class="create-layout" @submit.prevent="submitForm">
      <section class="panel form-panel">
        <div class="panel-header">
          <div>
            <h2>Datos del residente</h2>
            <p>Completa los campos obligatorios del payload de creacion.</p>
          </div>
        </div>

        <q-banner
          v-if="creationError || identificationTypesError || residentTypesError || housesError"
          rounded
          class="bg-red-1 text-negative q-mb-md"
        >
          {{ creationError || identificationTypesError || residentTypesError || housesError }}
        </q-banner>

        <div class="form-grid">
          <q-input
            v-model="form.firstName"
            outlined
            dense
            label="Nombre"
            hide-bottom-space
            class="soft-input"
            :rules="[requiredRule]"
            lazy-rules="ondemand"
          />
          <q-input
            v-model="form.lastName"
            outlined
            dense
            label="Apellido"
            hide-bottom-space
            class="soft-input"
            :rules="[requiredRule]"
            lazy-rules="ondemand"
          />

          <q-select
            v-model="form.identificationTypeId"
            outlined
            dense
            emit-value
            hide-bottom-space
            map-options
            :options="identificationTypeOptions"
            label="Tipo de identificacion"
            class="soft-input"
            :loading="identificationTypesLoading"
            :disable="identificationTypesLoading"
            :rules="[requiredRule]"
            lazy-rules="ondemand"
          />

          <q-input
            v-model="form.identificationNumber"
            outlined
            dense
            hide-bottom-space
            label="Numero de identificacion"
            class="soft-input"
            :rules="[requiredRule]"
            lazy-rules="ondemand"
          />

          <q-select
            v-model="form.relationshipTypeId"
            outlined
            dense
            emit-value
            map-options
            hide-bottom-space
            :options="residentTypeOptions"
            label="Relacion con la casa"
            class="soft-input"
            :loading="residentTypesLoading"
            :disable="residentTypesLoading"
            :rules="[requiredRule]"
            lazy-rules="ondemand"
          />

          <q-select
            v-model="form.houseId"
            outlined
            dense
            emit-value
            map-options
            :options="houseOptions"
            label="Casa"
            hide-bottom-space
            class="soft-input"
            :loading="housesLoading"
            :disable="housesLoading || !houseOptions.length"
            :rules="[requiredRule]"
            lazy-rules="ondemand"
          />

          <q-input
            v-model="form.email"
            outlined
            dense
            type="email"
            label="Correo"
            hide-bottom-space
            class="soft-input"
            :rules="[requiredRule, emailRule]"
            lazy-rules="ondemand"
          />
          <q-input
            v-model="form.mobilePhone"
            outlined
            dense
            hide-bottom-space
            label="Telefono movil"
            class="soft-input"
          />
          <q-input
            v-model="form.landlinePhone"
            outlined
            dense
            hide-bottom-space
            label="Telefono fijo"
            class="soft-input"
          />

          <q-input
            v-model="form.password"
            outlined
            dense
            type="password"
            hide-bottom-space
            label="Clave temporal"
            class="soft-input"
            :rules="[passwordRule]"
            lazy-rules="ondemand"
          />
          <q-input
            v-model="form.passwordConfirmation"
            outlined
            dense
            type="password"
            hide-bottom-space
            label="Confirmar clave"
            class="soft-input"
            :rules="[passwordConfirmationRule]"
            lazy-rules="ondemand"
          />

          <div class="form-grid__full resident-flags">
            <q-checkbox v-model="form.isPrimary" dense label="Residente principal" />
            <q-checkbox
              v-model="form.canReceiveNotifications"
              dense
              label="Puede recibir notificaciones"
            />
          </div>
        </div>
      </section>

      <aside class="panel summary-panel">
        <div class="panel-header">
          <div>
            <h2>Resumen</h2>
            <p>Revisa la informacion antes de guardar.</p>
          </div>
        </div>

        <div class="owner-summary">
          <div class="owner-summary__hero">
            <q-avatar color="primary" text-color="white" size="52px">
              {{ summaryInitials }}
            </q-avatar>
            <div>
              <span>Residente nuevo</span>
              <strong>{{ summaryName }}</strong>
              <small>{{ form.email || 'Sin correo' }}</small>
            </div>
          </div>

          <div class="owner-summary__grid">
            <div>
              <span>Identificacion</span>
              <strong>{{ selectedIdentificationType }}</strong>
            </div>
            <div>
              <span>Relacion</span>
              <strong>{{ selectedRelationshipType }}</strong>
            </div>
            <div>
              <span>Casa</span>
              <strong>{{ selectedHouseLabel }}</strong>
            </div>
            <div>
              <span>Condominio</span>
              <strong>{{ selectedCondominiumLabel }}</strong>
            </div>
            <div>
              <span>Telefono</span>
              <strong>{{ form.mobilePhone || form.landlinePhone || 'Sin telefono' }}</strong>
            </div>
            <div>
              <span>Notificaciones</span>
              <strong>{{ form.canReceiveNotifications ? 'Habilitadas' : 'Deshabilitadas' }}</strong>
            </div>
          </div>

          <q-banner class="bg-amber-1 text-amber-10 owner-summary__note" rounded>
            La casa debe existir antes de guardar. Si ya tiene un residente principal, el backend
            determinara si permite el reemplazo.
          </q-banner>

          <q-list separator class="clean-list q-mt-md">
            <q-item class="summary-row">
              <q-item-section avatar>
                <q-avatar icon="person" color="primary" text-color="white" size="36px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Nombre completo</q-item-label>
                <q-item-label caption>{{ summaryName }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="summary-row">
              <q-item-section avatar>
                <q-avatar icon="home_work" color="secondary" text-color="white" size="36px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Vivienda</q-item-label>
                <q-item-label caption>{{ selectedHouseLabel }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </aside>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAdminHouses } from '../composables/useAdminHouses';
import { useCatalog } from '../composables/useCatalog';
import { useResidentCreation } from '../composables/useResidentCreation';
import type {
  CreateResidentPayload,
  ResidentForm,
} from '../interfaces/residents/resident-form.interface';

const route = useRoute();
const residentFormRef = ref<{ validate: () => Promise<boolean> | boolean } | null>(null);

const pageError = ref('');
const successMessage = ref('');

const { houses, loading: housesLoading, error: housesError, loadHouses } = useAdminHouses();
const {
  items: identificationTypeItems,
  loading: identificationTypesLoading,
  error: identificationTypesError,
  loadCatalog: loadIdentificationTypes,
} = useCatalog('1');
const {
  items: residentTypeItems,
  loading: residentTypesLoading,
  error: residentTypesError,
  loadCatalog: loadResidentTypes,
} = useCatalog('3');
const { loading: creatingResident, error: creationError, createResident } = useResidentCreation();

const form = reactive<ResidentForm>({
  firstName: '',
  lastName: '',
  identificationTypeId: null,
  identificationNumber: '',
  mobilePhone: '',
  landlinePhone: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  houseId: null,
  relationshipTypeId: null,
  isPrimary: true,
  canReceiveNotifications: true,
});

const houseOptions = computed(() =>
  houses.value.map((house) => ({
    label: `${house.code} · ${house.condominiumName}`,
    value: String(house.id),
  })),
);

const identificationTypeOptions = computed(() =>
  identificationTypeItems.value
    .map((item) => ({
      label: item.label || item.name || 'Sin nombre',
      value: item.value ?? item.id ?? '',
    }))
    .filter((item) => item.value !== ''),
);

const residentTypeOptions = computed(() =>
  residentTypeItems.value
    .map((item) => ({
      label: item.label || item.name || 'Sin nombre',
      value: item.value ?? item.id ?? '',
    }))
    .filter((item) => item.value !== ''),
);

const selectedHouse = computed(
  () => houses.value.find((house) => String(house.id) === String(form.houseId)) || null,
);

const selectedHouseLabel = computed(() => {
  if (selectedHouse.value) {
    return `${selectedHouse.value.code} · ${selectedHouse.value.addressReference}`;
  }

  return String(route.query.house_label || route.query.house || 'Pendiente');
});

const selectedCondominiumLabel = computed(
  () =>
    selectedHouse.value?.condominiumName ||
    String(route.query.condominium_name || route.query.condominium || 'Pendiente'),
);

const summaryName = computed(() => {
  const fullName = [form.firstName, form.lastName].filter(Boolean).join(' ').trim();
  return fullName || 'Sin nombre';
});

const summaryInitials = computed(() => {
  const value = summaryName.value;
  return (
    value
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'RE'
  );
});

const selectedIdentificationType = computed(() => {
  const item = identificationTypeOptions.value.find(
    (option) => String(option.value) === String(form.identificationTypeId),
  );

  return item?.label || 'Pendiente';
});

const selectedRelationshipType = computed(() => {
  const item = residentTypeOptions.value.find(
    (option) => String(option.value) === String(form.relationshipTypeId),
  );

  return item?.label || 'Pendiente';
});

function normalizeOptional(value: string) {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function requiredRule(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return 'Este campo es obligatorio';
  }

  return true;
}

function emailRule(value: string) {
  if (!value.trim()) {
    return 'Ingresa un correo';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(value.trim()) ? true : 'Ingresa un correo valido';
}

function passwordRule(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return true;
  }

  return trimmed.length >= 8 ? true : 'La clave debe tener al menos 8 caracteres';
}

function passwordConfirmationRule(value: string) {
  const password = form.password.trim();
  const confirmation = value.trim();

  if (!password && !confirmation) {
    return true;
  }

  if (!password) {
    return 'Ingresa la clave temporal antes de confirmarla';
  }

  if (!confirmation) {
    return 'Confirma la clave temporal';
  }

  return password === confirmation ? true : 'La confirmacion no coincide';
}

function buildPayload() {
  const identificationTypeId = form.identificationTypeId;
  const relationshipTypeId = form.relationshipTypeId;
  const houseId = form.houseId;

  if (identificationTypeId === null || relationshipTypeId === null || houseId === null) {
    return null;
  }

  const payload: CreateResidentPayload = {
    first_name: form.firstName.trim(),
    last_name: form.lastName.trim(),
    identification_type_id: identificationTypeId,
    identification_number: form.identificationNumber.trim(),
    mobile_phone: normalizeOptional(form.mobilePhone),
    landline_phone: normalizeOptional(form.landlinePhone),
    email: form.email.trim(),
    house_id: houseId,
    relationship_type_id: relationshipTypeId,
    is_primary: form.isPrimary,
    can_receive_notifications: form.canReceiveNotifications,
  };

  const password = form.password.trim();

  if (password) {
    payload.password = password;
    payload.password_confirmation = form.passwordConfirmation.trim();
  }

  return payload;
}

function validateForm() {
  if (!form.firstName.trim()) {
    return 'Ingresa el nombre.';
  }

  if (!form.lastName.trim()) {
    return 'Ingresa el apellido.';
  }

  if (form.identificationTypeId === null) {
    return 'Selecciona el tipo de identificacion.';
  }

  if (!form.identificationNumber.trim()) {
    return 'Ingresa el numero de identificacion.';
  }

  if (form.relationshipTypeId === null) {
    return 'Selecciona la relacion con la casa.';
  }

  if (form.houseId === null) {
    return 'Selecciona la casa.';
  }

  if (!form.email.trim()) {
    return 'Ingresa un correo valido.';
  }

  const password = form.password.trim();
  const confirmation = form.passwordConfirmation.trim();

  if (password && password.length < 8) {
    return 'La clave temporal debe tener al menos 8 caracteres.';
  }

  if (password || confirmation) {
    if (!password) {
      return 'Ingresa la clave temporal.';
    }

    if (!confirmation) {
      return 'Confirma la clave temporal.';
    }

    if (password !== confirmation) {
      return 'La confirmacion de la clave no coincide.';
    }
  }

  return '';
}

async function loadPage() {
  pageError.value = '';

  try {
    await Promise.all([loadHouses(), loadIdentificationTypes(), loadResidentTypes()]);

    const initialHouseId = String(route.query.house_id || '');
    if (initialHouseId && !form.houseId) {
      form.houseId = initialHouseId;
    }
  } catch (exception) {
    pageError.value =
      exception instanceof Error ? exception.message : 'No se pudo cargar la pagina';
  }
}

async function submitForm() {
  successMessage.value = '';
  pageError.value = '';

  const isValid = await residentFormRef.value?.validate();
  if (!isValid) {
    return;
  }

  const validationError = validateForm();
  if (validationError) {
    pageError.value = validationError;
    return;
  }

  const payload = buildPayload();
  if (!payload) {
    pageError.value = 'Faltan datos requeridos para crear el residente.';
    return;
  }

  try {
    await createResident(payload);
    successMessage.value = 'Residente creado correctamente.';

    const currentHouseId = form.houseId;
    const currentRelationshipTypeId = form.relationshipTypeId;

    form.firstName = '';
    form.lastName = '';
    form.identificationTypeId = null;
    form.identificationNumber = '';
    form.mobilePhone = '';
    form.landlinePhone = '';
    form.email = '';
    form.password = '';
    form.passwordConfirmation = '';
    form.houseId = currentHouseId;
    form.relationshipTypeId = currentRelationshipTypeId;
    form.isPrimary = true;
    form.canReceiveNotifications = true;
  } catch (exception) {
    pageError.value =
      exception instanceof Error ? exception.message : 'No se pudo crear el residente';
  }
}

onMounted(() => {
  void loadPage();
});
</script>

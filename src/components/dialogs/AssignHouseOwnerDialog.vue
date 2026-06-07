<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="details-dialog owner-dialog">
      <q-card-section class="details-dialog__header">
        <div class="details-dialog__identity">
          <div>
            <h2>Asignar dueño</h2>
            <span>{{ houseLabel }} · {{ condominiumName }}</span>
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

        <q-banner rounded class="bg-blue-1 text-primary q-mb-md">
          <template #avatar>
            <q-avatar color="primary" text-color="white" size="32px">
              {{ house?.ownerInitials || 'DU' }}
            </q-avatar>
          </template>

          <div class="text-weight-medium">
            {{ house?.hasOwner ? 'Dueño actual' : 'La casa no tiene dueño asignado' }}
          </div>
          <div class="text-caption">
            {{
              house?.hasOwner
                ? `${house.ownerName} · ${house.ownerEmail}`
                : 'Selecciona un residente para mostrarlo en la ficha de la casa.'
            }}
          </div>
        </q-banner>

        <q-input
          v-model="search"
          outlined
          dense
          debounce="200"
          placeholder="Buscar residente"
          class="soft-input q-mb-md"
          :disable="loading || !residentOptions.length"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <div v-if="filteredResidents.length" class="owner-picker">
          <q-list bordered separator class="owner-picker__list">
            <q-item
              v-for="resident in filteredResidents"
              :key="resident.id"
              clickable
              :active="selectedResidentId === resident.id"
              active-class="owner-picker__item--active"
              @click="selectedResidentId = resident.id"
            >
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" size="40px">
                  {{ resident.initials }}
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-medium">{{ resident.name }}</q-item-label>
                <q-item-label caption>{{ resident.email }}</q-item-label>
                <q-item-label caption class="owner-picker__meta">
                  {{ resident.propertyLabel }} · {{ resident.role }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="owner-picker__status">
                  <q-badge
                    :color="resident.statusColor"
                    :label="resident.status"
                    class="status-badge"
                  />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <q-banner v-else rounded class="bg-grey-2 text-grey-8 q-mb-md">
          No hay residentes disponibles para seleccionar.
        </q-banner>
      </q-card-section>

      <q-card-actions align="between" class="details-dialog__actions">
        <q-btn
          flat
          color="primary"
          label="Sin dueño"
          no-caps
          :disable="loading"
          @click="selectedResidentId = null"
        />

        <div class="row q-gutter-sm">
          <q-btn flat color="primary" label="Cancelar" no-caps :disable="loading" v-close-popup />
          <q-btn
            color="primary"
            icon="person_add"
            label="Asignar"
            no-caps
            :loading="loading"
            :disable="!canSubmit"
            @click="submitForm"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { House } from '../../interfaces/houses/house.interface';
import type { HouseOwnerOption } from '../../interfaces/houses/house-owner.interface';

const props = defineProps<{
  modelValue: boolean;
  condominiumName: string;
  house?: House | null;
  residentOptions: HouseOwnerOption[];
  loading: boolean;
  error: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  submit: [resident: HouseOwnerOption | null];
}>();

const search = ref('');
const selectedResidentId = ref<number | null>(null);

const houseLabel = computed(() => {
  if (!props.house) {
    return 'Casa';
  }

  return `${props.house.code} · ${props.house.houseNumber}`;
});

const filteredResidents = computed(() => {
  const query = search.value.trim().toLowerCase();

  if (!query) {
    return props.residentOptions;
  }

  return props.residentOptions.filter((resident) => {
    const haystack = [
      resident.name,
      resident.email,
      resident.role,
      resident.propertyLabel,
      resident.status,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(query);
  });
});

const canSubmit = computed(() => !props.loading);

function assignSelectionFromHouse() {
  search.value = '';
  selectedResidentId.value = props.house?.ownerId ?? null;
}

function submitForm() {
  if (!canSubmit.value) {
    return;
  }

  const resident =
    selectedResidentId.value === null
      ? null
      : props.residentOptions.find((item) => item.id === selectedResidentId.value) || null;

  emit('submit', resident);
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) {
      return;
    }

    assignSelectionFromHouse();
  },
);
</script>

<style scoped>
.owner-picker__list {
  border-radius: 12px;
  overflow: hidden;
}

.owner-picker__item--active {
  background: rgba(25, 118, 210, 0.08);
}

.owner-picker__meta {
  margin-top: 2px;
}

.owner-picker__status {
  min-width: 72px;
  display: flex;
  justify-content: flex-end;
}
</style>

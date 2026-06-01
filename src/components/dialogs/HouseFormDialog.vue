<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="details-dialog">
      <q-card-section class="details-dialog__header">
        <div class="details-dialog__identity">
          <div>
            <h2>{{ isEditMode ? 'Editar casa' : 'Crear casa' }}</h2>
            <span>{{ condominiumName }}</span>
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

        <q-form class="dialog-form-grid" @submit.prevent="submitForm">
          <q-input
            v-model="form.houseNumber"
            outlined
            dense
            label="Numero de casa"
            class="soft-input"
            :disable="loading"
          />
          <q-input
            v-model="form.status"
            outlined
            dense
            label="Estado"
            class="soft-input"
            :disable="loading"
          />
          <q-input
            v-model="form.addressReference"
            outlined
            dense
            label="Referencia de direccion"
            class="soft-input dialog-form-grid__full"
            :disable="loading"
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="details-dialog__actions">
        <q-btn flat color="primary" label="Cancelar" no-caps :disable="loading" v-close-popup />
        <q-btn
          color="primary"
          :icon="isEditMode ? 'save' : 'add_home'"
          :label="isEditMode ? 'Guardar' : 'Crear'"
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
import { computed, reactive, watch } from 'vue';
import type { HouseForm } from '../../interfaces/houses/house-form.interface';
import type { House } from '../../interfaces/houses/house.interface';

const props = defineProps<{
  modelValue: boolean;
  condominiumName: string;
  house?: House | null;
  loading: boolean;
  error: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  submit: [form: HouseForm];
}>();

const form = reactive<HouseForm>({
  houseNumber: '',
  addressReference: '',
  status: 'active',
});

const isEditMode = computed(() => Boolean(props.house));
const canSubmit = computed(() => Boolean(form.houseNumber.trim()) && !props.loading);

function resetForm() {
  Object.assign(form, {
    houseNumber: '',
    addressReference: '',
    status: 'active',
  });
}

function assignForm(house: House) {
  Object.assign(form, {
    houseNumber: house.houseNumber === 'Sin numero' ? '' : house.houseNumber,
    addressReference: house.addressReference === 'Sin referencia' ? '' : house.addressReference,
    status: house.status || 'active',
  });
}

function submitForm() {
  if (!canSubmit.value) {
    return;
  }

  emit('submit', {
    houseNumber: form.houseNumber.trim(),
    addressReference: form.addressReference.trim(),
    status: form.status.trim() || 'active',
  });
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) {
      return;
    }

    if (props.house) {
      assignForm(props.house);
    } else {
      resetForm();
    }
  },
);
</script>

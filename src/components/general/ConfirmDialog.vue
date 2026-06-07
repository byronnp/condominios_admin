<template>
  <q-dialog
    :model-value="modelValue"
    :persistent="persistent"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="general-dialog">
      <q-card-section class="general-dialog__header">
        <div class="general-dialog__identity">
          <q-avatar :color="iconColor" text-color="white" size="42px" :icon="icon" />
          <div>
            <h2>{{ title }}</h2>
            <span>{{ subtitle }}</span>
          </div>
        </div>

        <q-btn flat round dense icon="close" aria-label="Cerrar dialogo" :disable="loading" v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section class="general-dialog__body">
        <p class="general-dialog__message">
          {{ message }}
        </p>

        <q-banner v-if="hint" rounded class="bg-blue-1 text-primary general-dialog__hint">
          {{ hint }}
        </q-banner>
      </q-card-section>

      <q-card-actions align="right" class="general-dialog__actions">
        <q-btn
          flat
          color="primary"
          :label="cancelLabel"
          no-caps
          :disable="loading"
          v-close-popup
          @click="emit('cancel')"
        />
        <q-btn
          :color="confirmColor"
          :icon="confirmIcon"
          :label="confirmLabel"
          no-caps
          :loading="loading"
          @click="emit('confirm')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title: string;
    message: string;
    subtitle?: string;
    hint?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmColor?: string;
    confirmIcon?: string;
    icon?: string;
    iconColor?: string;
    loading?: boolean;
    persistent?: boolean;
  }>(),
  {
    subtitle: 'Confirma la accion antes de continuar.',
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar',
    confirmColor: 'negative',
    confirmIcon: 'check',
    icon: 'warning',
    iconColor: 'negative',
    loading: false,
    persistent: true,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirm: [];
  cancel: [];
}>();

const title = computed(() => props.title);
const subtitle = computed(() => props.subtitle);
const message = computed(() => props.message);
const hint = computed(() => props.hint);
const confirmLabel = computed(() => props.confirmLabel);
const cancelLabel = computed(() => props.cancelLabel);
const confirmColor = computed(() => props.confirmColor);
const confirmIcon = computed(() => props.confirmIcon);
const icon = computed(() => props.icon);
const iconColor = computed(() => props.iconColor);
const loading = computed(() => props.loading);
const persistent = computed(() => props.persistent);
</script>

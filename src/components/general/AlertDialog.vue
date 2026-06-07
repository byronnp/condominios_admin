<template>
  <q-dialog :model-value="modelValue" :persistent="persistent" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="general-dialog">
      <q-card-section class="general-dialog__header">
        <div class="general-dialog__identity">
          <q-avatar :color="iconColor" text-color="white" size="42px" :icon="icon" />
          <div>
            <h2>{{ title }}</h2>
            <span>{{ subtitle }}</span>
          </div>
        </div>

        <q-btn flat round dense icon="close" aria-label="Cerrar alerta" v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section class="general-dialog__body">
        <p class="general-dialog__message">
          {{ message }}
        </p>

        <q-banner v-if="details" rounded class="general-dialog__hint" :class="bannerClass">
          {{ details }}
        </q-banner>
      </q-card-section>

      <q-card-actions align="right" class="general-dialog__actions">
        <q-btn flat color="primary" :label="closeLabel" no-caps v-close-popup @click="emit('close')" />
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
    details?: string;
    subtitle?: string;
    closeLabel?: string;
    icon?: string;
    iconColor?: string;
    tone?: 'info' | 'success' | 'warning' | 'error';
    persistent?: boolean;
  }>(),
  {
    subtitle: 'Revisa el mensaje antes de cerrar.',
    closeLabel: 'Entendido',
    icon: 'info',
    iconColor: 'primary',
    tone: 'info',
    persistent: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  close: [];
}>();

const bannerClass = computed(() => {
  const toneToClass: Record<string, string> = {
    info: 'bg-blue-1 text-primary',
    success: 'bg-green-1 text-positive',
    warning: 'bg-amber-1 text-amber-10',
    error: 'bg-red-1 text-negative',
  };

  return toneToClass[props.tone];
});

const title = computed(() => props.title);
const subtitle = computed(() => props.subtitle);
const message = computed(() => props.message);
const details = computed(() => props.details);
const closeLabel = computed(() => props.closeLabel);
const icon = computed(() => props.icon);
const iconColor = computed(() => props.iconColor);
</script>

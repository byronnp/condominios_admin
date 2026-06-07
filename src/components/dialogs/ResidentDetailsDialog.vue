<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="details-dialog">
      <q-card-section class="details-dialog__header">
        <div class="details-dialog__identity">
          <div>
            <h2>{{ resident?.name || 'Sin residente seleccionado' }}</h2>
            <span>{{ resident?.email || 'Sin correo registrado' }}</span>
          </div>
        </div>

        <div class="details-dialog__header-actions">
          <q-badge
            v-if="resident"
            :color="resident.statusColor"
            :label="resident.status"
            class="status-badge"
          />
          <q-btn flat round dense icon="close" aria-label="Cerrar detalle" v-close-popup />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section v-if="resident" class="details-grid">
        <article v-for="item in detailItems" :key="item.label" class="detail-item">
          <q-icon :name="item.icon" />
          <div>
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </div>
        </article>
      </q-card-section>

      <q-card-actions align="right" class="details-dialog__actions">
        <q-btn flat color="primary" label="Cerrar" no-caps v-close-popup />
        <q-btn color="primary" icon="edit" label="Editar" no-caps :disable="!resident" @click="emitEdit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ResidentDetails } from '../../interfaces/residents/resident.interface';

const props = defineProps<{
  modelValue: boolean;
  resident: ResidentDetails | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  edit: [id: number];
}>();

const detailItems = computed(() => {
  if (!props.resident) {
    return [];
  }

  return [
    { icon: 'badge', label: 'Identificacion', value: `${props.resident.identificationType} · ${props.resident.identificationNumber}` },
    { icon: 'apartment', label: 'Condominio', value: props.resident.condominium },
    { icon: 'home', label: 'Casa', value: props.resident.house },
    { icon: 'group', label: 'Relacion', value: props.resident.relationship },
    { icon: 'shield_person', label: 'Rol', value: props.resident.role },
    { icon: 'schedule', label: 'Ultima actividad', value: props.resident.lastActivity },
  ];
});

function emitEdit() {
  if (!props.resident) {
    return;
  }

  emit('edit', props.resident.id);
}
</script>

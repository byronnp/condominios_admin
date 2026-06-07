<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="details-dialog">
      <q-card-section class="details-dialog__header">
        <div class="details-dialog__identity">
          <div>
            <h2>{{ user?.name || 'Sin usuario seleccionado' }}</h2>
            <span>{{ user?.email || 'Sin correo registrado' }}</span>
          </div>
        </div>

        <div class="details-dialog__header-actions">
          <q-badge v-if="user" :color="user.statusColor" :label="user.status" class="status-badge" />
          <q-btn flat round dense icon="close" aria-label="Cerrar detalle" v-close-popup />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section v-if="user" class="details-grid">
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
        <q-btn color="primary" icon="edit" label="Editar" no-caps :disable="!user" @click="emitEdit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { UserDetails } from '../../../interfaces/users/user.interface';

const props = defineProps<{
  modelValue: boolean;
  user: UserDetails | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  edit: [id: number];
}>();

const detailItems = computed(() => {
  if (!props.user) {
    return [];
  }

  return [
    { icon: 'apartment', label: 'Condominio', value: props.user.condominium },
    { icon: 'home', label: 'Propiedad', value: props.user.property },
    { icon: 'badge', label: 'Rol', value: props.user.role },
    { icon: 'schedule', label: 'Ultima actividad', value: props.user.lastActivity },
  ];
});

function emitEdit() {
  if (!props.user) {
    return;
  }

  emit('edit', props.user.id);
}
</script>

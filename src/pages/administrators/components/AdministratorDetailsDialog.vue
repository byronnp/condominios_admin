<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="details-dialog">
      <q-card-section class="details-dialog__header">
        <div class="details-dialog__identity">
          <div>
            <h2>{{ administrator?.name || 'Sin administrador seleccionado' }}</h2>
            <span>{{ administrator?.email || 'Sin correo registrado' }}</span>
          </div>
        </div>

        <div class="details-dialog__header-actions">
          <q-badge
            v-if="administrator"
            :color="administrator.statusColor"
            :label="administrator.status"
            class="status-badge"
          />
          <q-btn flat round dense icon="close" aria-label="Cerrar detalle" v-close-popup />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section v-if="administrator" class="details-grid">
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
        <q-btn color="primary" icon="edit" label="Editar" no-caps :disable="!administrator" @click="emitEdit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { AdministratorDetails } from '../../../interfaces/administrators/administrator.interface';

const props = defineProps<{
  modelValue: boolean;
  administrator: AdministratorDetails | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  edit: [id: number];
}>();

const detailItems = computed(() => {
  if (!props.administrator) {
    return [];
  }

  return [
    { icon: 'apartment', label: 'Condominio', value: props.administrator.condominium },
    { icon: 'location_on', label: 'Ciudad', value: props.administrator.city },
    { icon: 'phone', label: 'Telefono', value: props.administrator.phone },
    { icon: 'home_work', label: 'Unidades gestionadas', value: `${props.administrator.managedUnits} unidades` },
    { icon: 'schedule', label: 'Ultimo acceso', value: props.administrator.lastAccess },
  ];
});

function emitEdit() {
  if (!props.administrator) {
    return;
  }

  emit('edit', props.administrator.id);
}
</script>

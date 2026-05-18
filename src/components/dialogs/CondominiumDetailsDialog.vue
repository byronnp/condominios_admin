<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="details-dialog">
      <q-card-section class="details-dialog__header">
        <div class="details-dialog__identity">
          <div>
            <h2>{{ condominium?.name || 'Sin condominio seleccionado' }}</h2>
            <span>{{ condominium?.address || 'Sin direccion registrada' }}</span>
          </div>
        </div>

        <div class="details-dialog__header-actions">
          <q-badge
            v-if="condominium"
            :color="condominium.statusColor"
            :label="condominium.status"
            class="status-badge"
          />
          <q-btn flat round dense icon="close" aria-label="Cerrar detalle" v-close-popup />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section v-if="condominium" class="details-grid">
        <article v-for="item in detailItems" :key="item.label" class="detail-item">
          <q-icon :name="item.icon" />
          <div>
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </div>
        </article>
      </q-card-section>

      <q-card-section v-if="condominium" class="details-progress">
        <div>
          <span>Ocupacion</span>
          <strong>{{ condominium.occupancy }}%</strong>
        </div>
        <q-linear-progress rounded size="7px" :value="condominium.occupancy / 100" color="primary" />
      </q-card-section>

      <q-card-actions align="right" class="details-dialog__actions">
        <q-btn flat color="primary" label="Cerrar" no-caps v-close-popup />
        <q-btn color="primary" icon="edit" label="Editar" no-caps :disable="!condominium" @click="emitEdit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CondominiumDetails } from '../../interfaces/condominiums/condominium.interface';

const props = defineProps<{
  modelValue: boolean;
  condominium: CondominiumDetails | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  edit: [id: number];
}>();

const detailItems = computed(() => {
  if (!props.condominium) {
    return [];
  }

  return [
    { icon: 'location_on', label: 'Ciudad', value: props.condominium.city },
    { icon: 'manage_accounts', label: 'Administrador', value: props.condominium.administrator },
    { icon: 'home_work', label: 'Unidades', value: `${props.condominium.units} unidades` },
    { icon: 'payments', label: 'Recaudacion mensual', value: props.condominium.revenue },
  ];
});

function emitEdit() {
  if (!props.condominium) {
    return;
  }

  emit('edit', props.condominium.id);
}
</script>

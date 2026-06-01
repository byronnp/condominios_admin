<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="details-dialog">
      <q-card-section class="details-dialog__header">
        <div class="details-dialog__identity">
          <div>
            <h2>Administradores</h2>
            <span>{{ condominium?.name || 'Selecciona un condominio' }}</span>
          </div>
        </div>

        <div class="details-dialog__header-actions">
          <q-btn
            outline
            color="primary"
            icon="person_add"
            label="Agregar"
            no-caps
            :disable="!condominium || loading"
            @click="emit('add')"
          />
          <q-btn flat round dense icon="close" aria-label="Cerrar administradores" v-close-popup />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-banner v-if="error" rounded class="bg-red-1 text-negative q-mb-md">
          {{ error }}
          <template #action>
            <q-btn flat color="negative" label="Reintentar" no-caps :disable="!condominium" @click="emit('retry')" />
          </template>
        </q-banner>

        <q-inner-loading :showing="loading">
          <q-spinner color="primary" size="32px" />
        </q-inner-loading>

        <q-list v-if="admins.length" separator class="clean-list admin-list">
          <q-item v-for="admin in admins" :key="admin.id" class="admin-list__item">
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white" size="38px">{{ admin.initials }}</q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ admin.name }}</q-item-label>
              <q-item-label caption>{{ admin.email }}</q-item-label>
              <q-item-label caption>{{ admin.identificationNumber }} - {{ admin.phone }}</q-item-label>
              <div class="admin-list__permissions">
                <q-badge
                  v-for="permission in admin.permissions"
                  :key="permission"
                  outline
                  color="primary"
                  :label="permission"
                />
                <q-badge v-if="!admin.permissions.length" outline color="grey" label="Sin permisos" />
              </div>
            </q-item-section>

            <q-item-section side>
              <div class="admin-list__actions">
                <q-badge outline color="positive" :label="admin.status" />
                <q-btn
                  flat
                  round
                  dense
                  color="primary"
                  icon="edit"
                  aria-label="Editar administrador"
                  :disable="deletingId !== null"
                  @click="emit('edit', admin.id)"
                />
                <q-btn
                  flat
                  round
                  dense
                  color="negative"
                  icon="delete"
                  aria-label="Eliminar administrador"
                  :loading="deletingId === admin.id"
                  :disable="deletingId !== null && deletingId !== admin.id"
                  @click="emit('delete', admin.id)"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>

        <div v-else-if="!loading" class="empty-state">
          <q-icon name="manage_accounts" />
          <strong>Sin administradores</strong>
          <span>Agrega el primer administrador para este condominio.</span>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { CondominiumAdmin } from '../../interfaces/administrators/administrator.interface';
import type { CondominiumDetails } from '../../interfaces/condominiums/condominium.interface';

defineProps<{
  modelValue: boolean;
  condominium: CondominiumDetails | null;
  admins: CondominiumAdmin[];
  loading: boolean;
  deletingId: number | null;
  error: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  add: [];
  retry: [];
  edit: [id: number];
  delete: [id: number];
}>();
</script>

<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Gestion de usuarios</p>
        <h1>Usuarios registrados</h1>
        <p>Consulta residentes, propietarios y accesos asociados a cada condominio.</p>
      </div>
      <div class="heading-actions">
        <q-btn outline color="primary" icon="download" label="Exportar" no-caps />
        <q-btn color="primary" icon="person_add" label="Nuevo usuario" to="/usuarios/nuevo" no-caps />
      </div>
    </section>

    <section class="panel data-panel">
      <div class="table-toolbar">
        <q-input v-model="filter" outlined dense hide-bottom-space debounce="250" placeholder="Buscar usuario" class="soft-input table-toolbar__search">
          <template #prepend><q-icon name="search" /></template>
        </q-input>
        <div class="table-toolbar__filters">
          <q-chip outline color="primary" icon="groups" label="1.284 usuarios" />
          <q-chip outline color="positive" icon="verified" label="1.102 activos" />
          <q-chip outline color="warning" icon="pending_actions" label="36 pendientes" />
        </div>
      </div>

      <q-table flat :rows="users" :columns="columns" row-key="id" :filter="filter" :grid="$q.screen.lt.md" class="soft-table">
        <template #body-cell-name="props">
          <q-td :props="props">
            <div class="condo-cell">
              <q-avatar color="primary" text-color="white" size="38px">{{ props.row.initials }}</q-avatar>
              <div><strong>{{ props.row.name }}</strong><span>{{ props.row.email }}</span></div>
            </div>
          </q-td>
        </template>
        <template #body-cell-status="props">
          <q-td :props="props"><q-badge :color="props.row.statusColor" :label="props.row.status" class="status-badge" /></q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props">
            <div class="row-actions">
              <q-btn flat round dense color="primary" icon="visibility" @click="openDetails(props.row)">
                <q-tooltip>Ver detalle</q-tooltip>
              </q-btn>
              <q-btn flat round dense color="primary" icon="edit" :to="`/usuarios/${props.row.id}/editar`">
                <q-tooltip>Editar usuario</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
        <template #item="props">
          <div class="condo-grid-card">
            <div class="condo-grid-card__header">
              <div class="condo-cell">
                <q-avatar color="primary" text-color="white" size="38px">{{ props.row.initials }}</q-avatar>
                <div><strong>{{ props.row.name }}</strong><span>{{ props.row.email }}</span></div>
              </div>
              <q-badge :color="props.row.statusColor" :label="props.row.status" class="status-badge" />
            </div>
            <div class="condo-grid-card__details">
              <span>Condominio<strong>{{ props.row.condominium }}</strong></span>
              <span>Propiedad<strong>{{ props.row.property }}</strong></span>
              <span>Rol<strong>{{ props.row.role }}</strong></span>
              <span>Actividad<strong>{{ props.row.lastActivity }}</strong></span>
            </div>
            <div class="row-actions row-actions--mobile">
              <q-btn flat round dense color="primary" icon="visibility" @click="openDetails(props.row)">
                <q-tooltip>Ver detalle</q-tooltip>
              </q-btn>
              <q-btn flat round dense color="primary" icon="edit" :to="`/usuarios/${props.row.id}/editar`">
                <q-tooltip>Editar usuario</q-tooltip>
              </q-btn>
            </div>
          </div>
        </template>
      </q-table>
    </section>

    <UserDetailsDialog v-model="showDetailsDialog" :user="selectedUser" @edit="goToEdit" />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar, type QTableColumn } from 'quasar';
import { useRouter } from 'vue-router';
import UserDetailsDialog from './components/UserDetailsDialog.vue';
import type { UserDetails } from '../../interfaces/users/user.interface';

const $q = useQuasar();
const router = useRouter();
const filter = ref('');
const showDetailsDialog = ref(false);
const selectedUser = ref<UserDetails | null>(null);

const columns: QTableColumn<UserDetails>[] = [
  { name: 'name', label: 'Usuario', field: 'name', align: 'left', sortable: true },
  { name: 'condominium', label: 'Condominio', field: 'condominium', align: 'left', sortable: true },
  { name: 'property', label: 'Propiedad', field: 'property', align: 'left', sortable: true },
  { name: 'role', label: 'Rol', field: 'role', align: 'left', sortable: true },
  { name: 'lastActivity', label: 'Actividad', field: 'lastActivity', align: 'left', sortable: true },
  { name: 'status', label: 'Estado', field: 'status', align: 'left', sortable: true },
  { name: 'actions', label: 'Acciones', field: 'id', align: 'right' },
];

const users: UserDetails[] = [
  { id: 1, initials: 'DP', name: 'Daniel Perez', email: 'daniel@email.com', condominium: 'Mirador Norte', property: 'Casa B-14', role: 'Residente', status: 'Activo', statusColor: 'positive', lastActivity: 'Hoy' },
  { id: 2, initials: 'LC', name: 'Lucia Castro', email: 'lucia@email.com', condominium: 'Portal del Bosque', property: 'Depto 302', role: 'Propietario', status: 'Activo', statusColor: 'positive', lastActivity: 'Ayer' },
  { id: 3, initials: 'RM', name: 'Rafael Mora', email: 'rafael@email.com', condominium: 'Las Cumbres', property: 'Casa A-07', role: 'Residente', status: 'Pendiente', statusColor: 'warning', lastActivity: 'Sin ingreso' },
  { id: 4, initials: 'AV', name: 'Ana Vera', email: 'ana@email.com', condominium: 'Riberas del Austro', property: 'Casa C-11', role: 'Propietario', status: 'Activo', statusColor: 'positive', lastActivity: '12 mayo' },
];

function openDetails(user: UserDetails) {
  selectedUser.value = user;
  showDetailsDialog.value = true;
}

function goToEdit(id: number) {
  showDetailsDialog.value = false;
  void router.push(`/usuarios/${id}/editar`);
}
</script>

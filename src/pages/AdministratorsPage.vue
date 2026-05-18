<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Gestion de administradores</p>
        <h1>Administradores registrados</h1>
        <p>Controla responsables asignados, acceso operativo y cobertura por condominio.</p>
      </div>

      <div class="heading-actions">
        <q-btn outline color="primary" icon="download" label="Exportar" no-caps />
        <q-btn color="primary" icon="person_add" label="Nuevo administrador" to="/administradores/nuevo" no-caps />
      </div>
    </section>

    <section class="panel data-panel">
      <div class="table-toolbar">
        <q-input v-model="filter" outlined dense debounce="250" placeholder="Buscar administrador" class="soft-input table-toolbar__search">
          <template #prepend><q-icon name="search" /></template>
        </q-input>
        <div class="table-toolbar__filters">
          <q-chip outline color="primary" icon="manage_accounts" label="26 administradores" />
          <q-chip outline color="positive" icon="verified" label="22 activos" />
          <q-chip outline color="warning" icon="pending_actions" label="4 pendientes" />
        </div>
      </div>

      <q-table flat :rows="administrators" :columns="columns" row-key="id" :filter="filter" :grid="$q.screen.lt.md" class="soft-table">
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
              <q-btn outline color="primary" icon="visibility" label="Ver" no-caps @click="openDetails(props.row)" />
              <q-btn flat color="primary" icon="edit" label="Editar" :to="`/administradores/${props.row.id}/editar`" no-caps />
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
              <span>Ciudad<strong>{{ props.row.city }}</strong></span>
              <span>Unidades<strong>{{ props.row.managedUnits }}</strong></span>
              <span>Acceso<strong>{{ props.row.lastAccess }}</strong></span>
            </div>
            <div class="row-actions row-actions--mobile">
              <q-btn outline color="primary" icon="visibility" label="Ver" no-caps @click="openDetails(props.row)" />
              <q-btn flat color="primary" icon="edit" label="Editar" :to="`/administradores/${props.row.id}/editar`" no-caps />
            </div>
          </div>
        </template>
      </q-table>
    </section>

    <AdministratorDetailsDialog v-model="showDetailsDialog" :administrator="selectedAdministrator" @edit="goToEdit" />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar, type QTableColumn } from 'quasar';
import { useRouter } from 'vue-router';
import AdministratorDetailsDialog from 'components/dialogs/AdministratorDetailsDialog.vue';
import type { AdministratorDetails } from '../interfaces/administrators/administrator.interface';

const $q = useQuasar();
const router = useRouter();
const filter = ref('');
const showDetailsDialog = ref(false);
const selectedAdministrator = ref<AdministratorDetails | null>(null);

const columns: QTableColumn<AdministratorDetails>[] = [
  { name: 'name', label: 'Administrador', field: 'name', align: 'left', sortable: true },
  { name: 'condominium', label: 'Condominio', field: 'condominium', align: 'left', sortable: true },
  { name: 'city', label: 'Ciudad', field: 'city', align: 'left', sortable: true },
  { name: 'managedUnits', label: 'Unidades', field: 'managedUnits', align: 'right', sortable: true },
  { name: 'lastAccess', label: 'Ultimo acceso', field: 'lastAccess', align: 'left', sortable: true },
  { name: 'status', label: 'Estado', field: 'status', align: 'left', sortable: true },
  { name: 'actions', label: 'Acciones', field: 'id', align: 'right' },
];

const administrators: AdministratorDetails[] = [
  { id: 1, initials: 'MB', name: 'Maria Beltran', email: 'maria@miradornorte.com', phone: '098 420 1180', condominium: 'Mirador Norte', city: 'Quito', status: 'Activo', statusColor: 'positive', lastAccess: 'Hoy', managedUnits: 84 },
  { id: 2, initials: 'JA', name: 'Jorge Andrade', email: 'jorge@portaldelbosque.com', phone: '098 610 3470', condominium: 'Portal del Bosque', city: 'Cuenca', status: 'Activo', statusColor: 'positive', lastAccess: 'Ayer', managedUnits: 64 },
  { id: 3, initials: 'SC', name: 'Sofia Cardenas', email: 'sofia@riberasdelaustro.com', phone: '098 770 4512', condominium: 'Riberas del Austro', city: 'Cuenca', status: 'Pendiente', statusColor: 'warning', lastAccess: 'Sin ingreso', managedUnits: 58 },
  { id: 4, initials: 'DT', name: 'Diego Torres', email: 'diego@lascumbres.com', phone: '099 138 7604', condominium: 'Las Cumbres', city: 'Quito', status: 'Activo', statusColor: 'positive', lastAccess: '10 mayo', managedUnits: 96 },
];

function openDetails(administrator: AdministratorDetails) {
  selectedAdministrator.value = administrator;
  showDetailsDialog.value = true;
}

function goToEdit(id: number) {
  showDetailsDialog.value = false;
  void router.push(`/administradores/${id}/editar`);
}
</script>

<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Gestion de condominios</p>
        <h1>Condominios registrados</h1>
        <p>
          Consulta el estado operativo, administradores asignados, ocupacion y recaudacion mensual de
          cada condominio.
        </p>
      </div>

      <div class="heading-actions">
        <q-btn outline color="primary" icon="download" label="Exportar" no-caps />
        <q-btn color="primary" icon="add_business" label="Nuevo condominio" to="/condominios/nuevo" no-caps />
      </div>
    </section>

    <section class="metric-grid">
      <article v-for="metric in metrics" :key="metric.label" class="metric-card metric-card--compact">
        <q-icon :name="metric.icon" class="metric-card__icon" />
        <span>{{ metric.label }}</span>
        <strong>{{ metric.value }}</strong>
        <small :class="metric.tone">{{ metric.detail }}</small>
      </article>
    </section>

    <section class="panel data-panel">
      <div class="table-toolbar">
        <q-input
          v-model="filter"
          outlined
          dense
          debounce="250"
          placeholder="Buscar condominio, administrador o ciudad"
          class="soft-input table-toolbar__search"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <div class="table-toolbar__filters">
          <q-chip outline color="primary" icon="apartment" label="18 activos" />
          <q-chip outline color="warning" icon="pending_actions" label="4 en revision" />
          <q-chip outline color="positive" icon="verified" label="12 al dia" />
        </div>
      </div>

      <q-table
        flat
        :rows="condominiums"
        :columns="columns"
        row-key="id"
        :filter="filter"
        :pagination="{ rowsPerPage: 6 }"
        :grid="$q.screen.lt.md"
        class="soft-table"
      >
        <template #body-cell-name="props">
          <q-td :props="props">
            <div class="condo-cell">
              <q-avatar color="primary" text-color="white" size="38px">{{ props.row.initials }}</q-avatar>
              <div>
                <strong>{{ props.row.name }}</strong>
                <span>{{ props.row.address }}</span>
              </div>
            </div>
          </q-td>
        </template>

        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="props.row.statusColor" :label="props.row.status" class="status-badge" />
          </q-td>
        </template>

        <template #body-cell-occupancy="props">
          <q-td :props="props">
            <div class="progress-cell">
              <span>{{ props.row.occupancy }}%</span>
              <q-linear-progress rounded size="7px" :value="props.row.occupancy / 100" color="primary" />
            </div>
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props">
            <div class="row-actions">
              <q-btn outline color="primary" icon="visibility" label="Ver" no-caps @click="openDetails(props.row)" />
              <q-btn
                flat
                color="primary"
                icon="edit"
                label="Editar"
                :to="`/condominios/${props.row.id}/editar`"
                no-caps
              />
            </div>
          </q-td>
        </template>

        <template #item="props">
          <div class="condo-grid-card">
            <div class="condo-grid-card__header">
              <div class="condo-cell">
                <q-avatar color="primary" text-color="white" size="38px">{{ props.row.initials }}</q-avatar>
                <div>
                  <strong>{{ props.row.name }}</strong>
                  <span>{{ props.row.address }}</span>
                </div>
              </div>
              <q-badge :color="props.row.statusColor" :label="props.row.status" class="status-badge" />
            </div>

            <div class="condo-grid-card__details">
              <span>Ciudad<strong>{{ props.row.city }}</strong></span>
              <span>Administrador<strong>{{ props.row.administrator }}</strong></span>
              <span>Unidades<strong>{{ props.row.units }}</strong></span>
              <span>Recaudacion<strong>{{ props.row.revenue }}</strong></span>
            </div>

            <div class="progress-cell">
              <span>Ocupacion {{ props.row.occupancy }}%</span>
              <q-linear-progress rounded size="7px" :value="props.row.occupancy / 100" color="primary" />
            </div>

            <div class="row-actions row-actions--mobile">
              <q-btn outline color="primary" icon="visibility" label="Ver" no-caps @click="openDetails(props.row)" />
              <q-btn
                flat
                color="primary"
                icon="edit"
                label="Editar"
                :to="`/condominios/${props.row.id}/editar`"
                no-caps
              />
            </div>
          </div>
        </template>
      </q-table>
    </section>

    <CondominiumDetailsDialog
      v-model="showDetailsDialog"
      :condominium="selectedCondominium"
      @edit="goToEdit"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar, type QTableColumn } from 'quasar';
import { useRouter } from 'vue-router';
import CondominiumDetailsDialog from 'components/dialogs/CondominiumDetailsDialog.vue';
import type { CondominiumDetails } from '../interfaces/condominiums/condominium.interface';
import type { CondominiumMetric } from '../interfaces/condominiums/condominium-metric.interface';

type Condominium = CondominiumDetails;

const filter = ref('');
const router = useRouter();
const $q = useQuasar();
const showDetailsDialog = ref(false);
const selectedCondominium = ref<Condominium | null>(null);

const metrics: CondominiumMetric[] = [
  { label: 'Condominios', value: '18', detail: '16 operativos', icon: 'apartment', tone: 'positive' },
  { label: 'Unidades', value: '1.284', detail: '91% ocupadas', icon: 'home_work', tone: 'neutral' },
  { label: 'Recaudacion', value: '$48.760', detail: '+6.4% mensual', icon: 'payments', tone: 'positive' },
  { label: 'Alertas', value: '4', detail: 'Requieren revision', icon: 'flag', tone: 'warning' },
];

const columns: QTableColumn<Condominium>[] = [
  { name: 'name', label: 'Condominio', field: 'name', align: 'left', sortable: true },
  { name: 'city', label: 'Ciudad', field: 'city', align: 'left', sortable: true },
  { name: 'administrator', label: 'Administrador', field: 'administrator', align: 'left', sortable: true },
  { name: 'units', label: 'Unidades', field: 'units', align: 'right', sortable: true },
  { name: 'occupancy', label: 'Ocupacion', field: 'occupancy', align: 'left', sortable: true },
  { name: 'revenue', label: 'Recaudacion', field: 'revenue', align: 'right', sortable: true },
  { name: 'status', label: 'Estado', field: 'status', align: 'left', sortable: true },
  { name: 'updatedAt', label: 'Actualizado', field: 'updatedAt', align: 'left', sortable: true },
  { name: 'actions', label: 'Acciones', field: 'id', align: 'right' },
];

const condominiums: Condominium[] = [
  {
    id: 1,
    initials: 'MN',
    name: 'Mirador Norte',
    address: 'Av. de los Granados N42-18',
    city: 'Quito',
    administrator: 'Maria Beltran',
    units: 84,
    occupancy: 94,
    revenue: '$8.420',
    status: 'Activo',
    statusColor: 'positive',
    updatedAt: 'Hoy',
  },
  {
    id: 2,
    initials: 'AV',
    name: 'Altos del Valle',
    address: 'Via Intervalles km 7',
    city: 'Quito',
    administrator: 'Pendiente',
    units: 126,
    occupancy: 72,
    revenue: '$5.180',
    status: 'En revision',
    statusColor: 'warning',
    updatedAt: 'Ayer',
  },
  {
    id: 3,
    initials: 'PB',
    name: 'Portal del Bosque',
    address: 'Calle Cedros y Arrayanes',
    city: 'Cuenca',
    administrator: 'Jorge Andrade',
    units: 64,
    occupancy: 88,
    revenue: '$4.960',
    status: 'Activo',
    statusColor: 'positive',
    updatedAt: '15 mayo',
  },
  {
    id: 4,
    initials: 'SC',
    name: 'Sol del Caribe',
    address: 'Malecon 2000, bloque C',
    city: 'Guayaquil',
    administrator: 'Paula Mendez',
    units: 142,
    occupancy: 97,
    revenue: '$11.340',
    status: 'Activo',
    statusColor: 'positive',
    updatedAt: '14 mayo',
  },
  {
    id: 5,
    initials: 'RA',
    name: 'Riberas del Austro',
    address: 'Av. Loja y Primero de Mayo',
    city: 'Cuenca',
    administrator: 'Sofia Cardenas',
    units: 58,
    occupancy: 81,
    revenue: '$3.870',
    status: 'Pendiente',
    statusColor: 'warning',
    updatedAt: '12 mayo',
  },
  {
    id: 6,
    initials: 'LC',
    name: 'Las Cumbres',
    address: 'Ruta Viva km 11',
    city: 'Quito',
    administrator: 'Diego Torres',
    units: 96,
    occupancy: 90,
    revenue: '$7.230',
    status: 'Activo',
    statusColor: 'positive',
    updatedAt: '10 mayo',
  },
];

function openDetails(condominium: Condominium) {
  selectedCondominium.value = condominium;
  showDetailsDialog.value = true;
}

function goToEdit(id: number) {
  showDetailsDialog.value = false;
  void router.push(`/condominios/${id}/editar`);
}
</script>

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
          <q-chip outline color="primary" icon="apartment" :label="`${activeCount} activos`" />
          <q-chip outline color="warning" icon="pending_actions" :label="`${pendingCount} en revision`" />
          <q-chip outline color="positive" icon="verified" :label="`${currentCount} al dia`" />
        </div>
      </div>

      <q-banner v-if="error" rounded class="bg-red-1 text-negative q-mb-md">
        {{ error }}
        <template #action>
          <q-btn flat color="negative" label="Reintentar" no-caps @click="loadCondominiums" />
        </template>
      </q-banner>

      <q-table
        flat
        :rows="condominiums"
        :columns="columns"
        row-key="id"
        :filter="filter"
        :loading="loading"
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
              <q-btn flat round dense color="primary" icon="visibility" @click="openDetails(props.row)">
                <q-tooltip>Ver detalle</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="manage_accounts"
                @click="goToAdmins(props.row)"
              >
                <q-tooltip>Ver administradores</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="home_work"
                @click="goToHouses(props.row)"
              >
                <q-tooltip>Ver casas</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="groups"
                @click="goToDirective(props.row)"
              >
                <q-tooltip>Ver directiva</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="admin_panel_settings"
                @click="goToRoles(props.row)"
              >
                <q-tooltip>Roles del condominio</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="edit"
                :to="`/condominios/${props.row.id}/editar`"
              >
                <q-tooltip>Editar condominio</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="negative"
                icon="delete"
                :loading="deletingId === props.row.id"
                :disable="deletingId !== null && deletingId !== props.row.id"
                @click="deleteCondominium(props.row)"
              >
                <q-tooltip>Eliminar condominio</q-tooltip>
              </q-btn>
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
              <q-btn flat round dense color="primary" icon="visibility" @click="openDetails(props.row)">
                <q-tooltip>Ver detalle</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="manage_accounts"
                @click="goToAdmins(props.row)"
              >
                <q-tooltip>Ver administradores</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="home_work"
                @click="goToHouses(props.row)"
              >
                <q-tooltip>Ver casas</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="groups"
                @click="goToDirective(props.row)"
              >
                <q-tooltip>Ver directiva</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="admin_panel_settings"
                @click="goToRoles(props.row)"
              >
                <q-tooltip>Roles del condominio</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="edit"
                :to="`/condominios/${props.row.id}/editar`"
              >
                <q-tooltip>Editar condominio</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="negative"
                icon="delete"
                :loading="deletingId === props.row.id"
                :disable="deletingId !== null && deletingId !== props.row.id"
                @click="deleteCondominium(props.row)"
              >
                <q-tooltip>Eliminar condominio</q-tooltip>
              </q-btn>
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

    <ConfirmDialog
      v-model="showDeleteDialog"
      title="Eliminar condominio"
      :message="deleteDialogMessage"
      subtitle="Confirma antes de continuar."
      hint="Esta accion solo afecta el registro seleccionado."
      confirm-label="Eliminar"
      cancel-label="Cancelar"
      confirm-color="negative"
      confirm-icon="delete"
      icon="delete"
      icon-color="negative"
      @confirm="deleteSelectedCondominium"
    />  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useQuasar, type QTableColumn } from 'quasar';
import { useRouter } from 'vue-router';
import CondominiumDetailsDialog from './components/CondominiumDetailsDialog.vue';
import ConfirmDialog from 'components/general/ConfirmDialog.vue';
import { useCondominiums } from '../../composables/condominiums/useCondominiums';
import type { CondominiumDetails } from '../../interfaces/condominiums/condominium.interface';
import type { CondominiumMetric } from '../../interfaces/condominiums/condominium-metric.interface';

type Condominium = CondominiumDetails;

const filter = ref('');
const router = useRouter();
const $q = useQuasar();
const showDetailsDialog = ref(false);
const showDeleteDialog = ref(false);
const selectedCondominium = ref<Condominium | null>(null);
const condominiumToDelete = ref<Condominium | null>(null);
const { condominiums, loading, deletingId, error, loadCondominiums, removeCondominium } = useCondominiums();

const activeCount = computed(() => condominiums.value.filter((condominium) => condominium.statusColor === 'positive').length);
const pendingCount = computed(() => condominiums.value.filter((condominium) => condominium.statusColor === 'warning').length);
const currentCount = computed(() => condominiums.value.filter((condominium) => condominium.updatedAt !== 'Sin actualizar').length);
const totalUnits = computed(() => condominiums.value.reduce((total, condominium) => total + condominium.units, 0));
const averageOccupancy = computed(() => {
  if (!condominiums.value.length) {
    return 0;
  }

  const occupancyTotal = condominiums.value.reduce((total, condominium) => total + condominium.occupancy, 0);
  return Math.round(occupancyTotal / condominiums.value.length);
});

const metrics = computed<CondominiumMetric[]>(() => [
  {
    label: 'Condominios',
    value: String(condominiums.value.length),
    detail: `${activeCount.value} operativos`,
    icon: 'apartment',
    tone: 'positive',
  },
  {
    label: 'Unidades',
    value: new Intl.NumberFormat('es-EC').format(totalUnits.value),
    detail: `${averageOccupancy.value}% ocupadas`,
    icon: 'home_work',
    tone: 'neutral',
  },
  {
    label: 'Recaudacion',
    value: '-',
    detail: 'Segun API',
    icon: 'payments',
    tone: 'positive',
  },
  {
    label: 'Alertas',
    value: String(pendingCount.value),
    detail: 'Requieren revision',
    icon: 'flag',
    tone: 'warning',
  },
]);

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

function openDetails(condominium: Condominium) {
  selectedCondominium.value = condominium;
  showDetailsDialog.value = true;
}

function goToEdit(id: number) {
  showDetailsDialog.value = false;
  void router.push(`/condominios/${id}/editar`);
}

function goToAdmins(condominium: Condominium) {
  console.info('Datos enviados a administradores del condominio', condominium);
  void router.push(`/condominios/${condominium.id}/administradores`);
}

function goToHouses(condominium: Condominium) {
  void router.push(`/condominios/${condominium.id}/casas`);
}

function goToDirective(condominium: Condominium) {
  void router.push(`/condominios/${condominium.id}/directiva`);
}

function goToRoles(condominium: Condominium) {
  void router.push({
    path: '/admin/roles',
    query: {
      scope: 'condominium',
      condominiumId: String(condominium.id),
      condominiumName: condominium.name,
      openCreate: '1',
    },
  });
}

function deleteCondominium(condominium: Condominium) {
  condominiumToDelete.value = condominium;
  showDeleteDialog.value = true;
}

function deleteSelectedCondominium() {
  if (!condominiumToDelete.value) {
    return;
  }

  void removeCondominium(condominiumToDelete.value.id);
  condominiumToDelete.value = null;
  showDeleteDialog.value = false;
}

const deleteDialogMessage = computed(() =>
  condominiumToDelete.value
    ? `¿Deseas eliminar ${condominiumToDelete.value.name}? Esta accion no se puede deshacer.`
    : '¿Deseas eliminar este condominio? Esta accion no se puede deshacer.',
);
onMounted(() => {
  void loadCondominiums();
});
</script>


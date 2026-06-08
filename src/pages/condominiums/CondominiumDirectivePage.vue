<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">Gestiones de directiva</p>
        <h1>{{ condominium?.name || 'Condominio' }}</h1>
        <p>
          Cada condominio puede tener varias gestiones a lo largo del tiempo. Dentro de cada gestion
          se administra la directiva vigente y sus miembros residentes o externos.
        </p>
      </div>

      <div class="heading-actions">
        <q-btn
          outline
          color="primary"
          icon="arrow_back"
          label="Volver"
          to="/condominios"
          no-caps
        />
        <q-btn
          color="primary"
          icon="event"
          label="Nueva gestion"
          no-caps
          :disable="!condominium"
          @click="openCreatePeriod"
        />
      </div>
    </section>

    <section class="stats-grid">
      <q-card v-for="item in stats" :key="item.label" class="panel stat-card">
        <q-card-section class="stat-card__body">
          <q-avatar :color="item.color" text-color="white" size="42px">
            <q-icon :name="item.icon" />
          </q-avatar>
          <div>
            <span class="text-caption text-grey-7">{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </div>
        </q-card-section>
      </q-card>
    </section>

    <section class="create-layout">
      <div class="form-panel">
        <section class="panel data-panel">
          <div class="table-toolbar">
            <q-input
              v-model="filter"
              outlined
              dense
              debounce="250"
              placeholder="Buscar gestion, fechas o miembro"
              class="soft-input table-toolbar__search"
            >
              <template #prepend>
                <q-icon name="search" />
              </template>
            </q-input>

            <div class="table-toolbar__filters">
              <q-chip outline color="primary" icon="event" :label="`${periods.length} gestiones`" />
              <q-chip outline color="positive" icon="verified" :label="`${activePeriods} vigentes`" />
              <q-chip outline color="warning" icon="history" :label="`${closedPeriods} cerradas`" />
            </div>
          </div>

          <q-banner v-if="pageError" rounded class="bg-red-1 text-negative q-mb-md">
            {{ pageError }}
            <template #action>
              <q-btn flat color="negative" label="Reintentar" no-caps @click="loadPage" />
            </template>
          </q-banner>

          <q-banner v-if="!periods.length && !condominiumLoading" rounded class="bg-blue-1 text-primary q-mb-md">
            Aun no hay gestiones registradas para este condominio.
          </q-banner>

          <div class="directive-period-list">
            <q-card
              v-for="period in filteredPeriods"
              :key="period.id"
              class="directive-period-card"
              :class="{ 'directive-period-card--active': selectedPeriod?.id === period.id }"
              clickable
              @click="selectPeriod(period)"
            >
              <q-card-section class="directive-period-card__header">
                <div class="directive-period-card__identity">
                  <q-avatar color="primary" text-color="white" size="42px">
                    <q-icon name="event" />
                  </q-avatar>

                  <div>
                    <div class="directive-period-card__title">
                      <strong>{{ period.title }}</strong>
                      <q-badge :color="statusColor(period.status)" :label="statusLabel(period.status)" />
                    </div>
                    <p>{{ period.periodStart }} - {{ period.periodEnd || 'Sin fecha fin' }}</p>
                  </div>
                </div>

                <div class="row-actions directive-period-card__actions">
                  <q-btn flat round dense color="primary" icon="edit" @click.stop="openEditPeriod(period)">
                    <q-tooltip>Editar gestion</q-tooltip>
                  </q-btn>
                  <q-btn flat round dense color="primary" icon="group_add" @click.stop="selectPeriod(period)">
                    <q-tooltip>Ver directiva</q-tooltip>
                  </q-btn>
                </div>
              </q-card-section>

              <q-card-section class="directive-period-card__body">
                <div class="directive-period-card__metrics">
                  <div>
                    <span>Miembros</span>
                    <strong>{{ period.members.length }}</strong>
                  </div>
                  <div>
                    <span>Residentes</span>
                    <strong>{{ countMembersByType(period.members, 'resident') }}</strong>
                  </div>
                  <div>
                    <span>Externos</span>
                    <strong>{{ countMembersByType(period.members, 'external') }}</strong>
                  </div>
                </div>
                <p class="owner-summary__note text-grey-7">
                  {{ period.notes || 'Sin observaciones registradas.' }}
                </p>
              </q-card-section>
            </q-card>
          </div>
        </section>
      </div>

      <aside class="summary-panel">
        <q-card class="panel">
          <q-card-section class="panel-header">
            <div>
              <h2>Directiva de la gestion</h2>
              <p>Miembros asignados al periodo seleccionado.</p>
            </div>

            <q-chip outline color="primary" icon="event" :label="selectedPeriodLabel" />
          </q-card-section>

          <q-card-section class="owner-summary">
            <div class="owner-summary__hero">
              <q-avatar color="primary" text-color="white" size="48px">
                <q-icon name="groups" />
              </q-avatar>
              <div>
                <span>Gestion activa</span>
                <strong>{{ selectedPeriod?.title || 'Selecciona una gestion' }}</strong>
                <small>
                  {{ selectedPeriod ? `${selectedPeriod.periodStart} al ${selectedPeriod.periodEnd || 'actualidad'}` : 'No hay gestion seleccionada' }}
                </small>
              </div>
            </div>

            <div class="owner-summary__grid">
              <div>
                <span>Presidente</span>
                <strong>{{ selectedRoleNames.president }}</strong>
              </div>
              <div>
                <span>Secretario</span>
                <strong>{{ selectedRoleNames.secretary }}</strong>
              </div>
              <div>
                <span>Tesorero</span>
                <strong>{{ selectedRoleNames.treasurer }}</strong>
              </div>
              <div>
                <span>Vocal</span>
                <strong>{{ selectedRoleNames.vocal }}</strong>
              </div>
            </div>

            <div class="owner-summary__grid">
              <div>
                <span>Residentes</span>
                <strong>{{ selectedPeriodResidentCount }}</strong>
              </div>
              <div>
                <span>Externos</span>
                <strong>{{ selectedPeriodExternalCount }}</strong>
              </div>
            </div>

            <q-banner rounded class="bg-blue-1 text-primary">
              Los miembros externos solo deben usarse para roles tecnicos o de soporte, como contabilidad o asesoria.
            </q-banner>

            <div class="summary-actions">
              <q-btn
                color="primary"
                icon="group_add"
                label="Agregar miembro"
                class="full-width"
                no-caps
                :disable="!selectedPeriod"
                @click="openCreateMember"
              />
            </div>
          </q-card-section>
        </q-card>

        <q-card class="panel q-mt-md">
          <q-card-section class="panel-header panel-header--stacked">
            <div>
              <h2>Miembros de la directiva</h2>
              <p>Listado del periodo seleccionado.</p>
            </div>

            <div class="table-toolbar__filters">
              <q-chip outline color="primary" icon="groups" :label="`${selectedPeriodMembers.length} miembros`" />
              <q-chip outline color="secondary" icon="work" :label="`${selectedPeriodResidentCount} residentes`" />
              <q-chip outline color="accent" icon="business_center" :label="`${selectedPeriodExternalCount} externos`" />
            </div>
          </q-card-section>

          <div class="table-toolbar table-toolbar--compact">
            <q-input
              v-model="memberFilter"
              outlined
              dense
              debounce="250"
              placeholder="Buscar miembro, cargo, documento o nota"
              class="soft-input table-toolbar__search"
              :disable="!selectedPeriod"
            >
              <template #prepend>
                <q-icon name="manage_search" />
              </template>
            </q-input>
          </div>

          <q-banner v-if="!selectedPeriod" rounded class="bg-blue-1 text-primary">
            Selecciona una gestion para ver sus miembros.
          </q-banner>

          <q-table
            v-else
            flat
            :rows="filteredMembers"
            :columns="memberColumns"
            row-key="id"
            :loading="condominiumLoading"
            :pagination="{ rowsPerPage: 5 }"
            :grid="$q.screen.lt.md"
            class="soft-table"
          >
            <template #no-data>
              <div class="empty-state">
                <q-icon name="groups_off" />
                <strong>Sin miembros registrados</strong>
                <span>Agrega el primer miembro para comenzar a administrar esta gestion.</span>
              </div>
            </template>

            <template #body-cell-fullName="props">
              <q-td :props="props">
                <div class="condo-cell">
                  <q-avatar :color="props.row.memberType === 'resident' ? 'primary' : 'secondary'" text-color="white" size="38px">
                    {{ props.row.initials }}
                  </q-avatar>
                  <div>
                    <strong>{{ props.row.fullName }}</strong>
                    <span>{{ props.row.memberTypeLabel }}</span>
                  </div>
                </div>
              </q-td>
            </template>

            <template #body-cell-role="props">
              <q-td :props="props">
                <q-badge outline color="primary" :label="props.row.roleLabel" />
              </q-td>
            </template>

            <template #body-cell-status="props">
              <q-td :props="props">
                <q-badge :color="props.row.statusColor" :label="props.row.statusLabel" class="status-badge" />
              </q-td>
            </template>

            <template #body-cell-actions="props">
              <q-td :props="props">
                <div class="row-actions">
                  <q-btn flat round dense color="primary" icon="edit" @click="openEditMember(props.row)">
                    <q-tooltip>Editar miembro</q-tooltip>
                  </q-btn>
                  <q-btn flat round dense color="negative" icon="delete" @click="deleteMember(props.row)">
                    <q-tooltip>Dar de baja</q-tooltip>
                  </q-btn>
                </div>
              </q-td>
            </template>

            <template #item="props">
              <div class="condo-grid-card">
                <div class="condo-grid-card__header">
                  <div class="condo-cell">
                    <q-avatar :color="props.row.memberType === 'resident' ? 'primary' : 'secondary'" text-color="white" size="38px">
                      {{ props.row.initials }}
                    </q-avatar>
                    <div>
                      <strong>{{ props.row.fullName }}</strong>
                      <span>{{ props.row.memberTypeLabel }}</span>
                    </div>
                  </div>
                  <q-badge :color="props.row.statusColor" :label="props.row.statusLabel" class="status-badge" />
                </div>

                <div class="condo-grid-card__details">
                  <span>Cargo<strong>{{ props.row.roleLabel }}</strong></span>
                  <span>Documento<strong>{{ props.row.document }}</strong></span>
                  <span>Periodo<strong>{{ props.row.periodStart }} - {{ props.row.periodEnd || 'Sin fecha fin' }}</strong></span>
                  <span>Tipo<strong>{{ props.row.memberTypeLabel }}</strong></span>
                </div>

                <p class="owner-summary__note text-grey-7">
                  {{ props.row.notes || 'Sin observaciones registradas.' }}
                </p>

                <div class="row-actions row-actions--mobile">
                  <q-btn flat round dense color="primary" icon="edit" @click="openEditMember(props.row)">
                    <q-tooltip>Editar miembro</q-tooltip>
                  </q-btn>
                  <q-btn flat round dense color="negative" icon="delete" @click="deleteMember(props.row)">
                    <q-tooltip>Dar de baja</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </template>
          </q-table>
        </q-card>
      </aside>
    </section>

    <CondominiumDirectivePeriodDialog
      v-model="showPeriodDialog"
      :mode="selectedPeriodToEdit ? 'edit' : 'create'"
      :loading="savingPeriod"
      :error="periodError"
      :period="selectedPeriodToEdit"
      @submit="submitPeriod"
    />

    <CondominiumDirectiveMemberDialog
      v-model="showMemberDialog"
      :mode="selectedMember ? 'edit' : 'create'"
      :loading="savingMember"
      :error="memberError"
      :member="selectedMember"
      :resident-options="residentOptions"
      @submit="submitMember"
    />

    <ConfirmDialog
      v-model="showDeleteDialog"
      title="Dar de baja miembro"
      :message="deleteDialogMessage"
      subtitle="Confirma antes de continuar."
      hint="Esta accion solo afecta al registro seleccionado."
      confirm-label="Dar de baja"
      cancel-label="Cancelar"
      confirm-color="negative"
      confirm-icon="delete"
      icon="delete"
      icon-color="negative"
      @confirm="deleteSelectedMember"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useQuasar, type QTableColumn } from 'quasar';
import { useRoute } from 'vue-router';
import ConfirmDialog from 'components/general/ConfirmDialog.vue';
import CondominiumDirectivePeriodDialog from './components/CondominiumDirectivePeriodDialog.vue';
import CondominiumDirectiveMemberDialog from './components/CondominiumDirectiveMemberDialog.vue';
import type { CondominiumDetails, AdminCondominiumResponse } from '../../interfaces/condominiums/condominium.interface';
import type {
  CondominiumDirectiveForm,
  CondominiumDirectiveMember,
  CondominiumDirectiveMemberType,
  CondominiumDirectivePeriod,
  CondominiumDirectivePeriodForm,
  CondominiumDirectiveStatus,
} from '../../interfaces/condominiums/condominium-directive.interface';
import { getAdminCondominiumById } from '../../services/condominiums/condominiums.service';

const route = useRoute();
const $q = useQuasar();
const filter = ref('');
const memberFilter = ref('');
const condominium = ref<CondominiumDetails | null>(null);
const condominiumLoading = ref(false);
const pageError = ref('');
const showPeriodDialog = ref(false);
const showMemberDialog = ref(false);
const showDeleteDialog = ref(false);
const selectedPeriodId = ref<number | null>(1);
const selectedPeriodToEdit = ref<CondominiumDirectivePeriod | null>(null);
const selectedMember = ref<CondominiumDirectiveMember | null>(null);
const memberToDelete = ref<CondominiumDirectiveMember | null>(null);
const savingPeriod = ref(false);
const savingMember = ref(false);
const periodError = ref('');
const memberError = ref('');

const residentOptions = ref([
  { label: 'Ana Lopez', value: 101 },
  { label: 'Carlos Rivera', value: 102 },
  { label: 'Maria Sanchez', value: 103 },
  { label: 'Luis Herrera', value: 104 },
]);

const periods = ref<CondominiumDirectivePeriod[]>([
  {
    id: 1,
    title: 'Gestion 2026',
    periodStart: '2026-01-01',
    periodEnd: '2026-12-31',
    status: 'vigente',
    notes: 'Gestion actual del condominio con directiva operativa.',
    members: [
      {
        id: 11,
        residentId: 101,
        fullName: 'Ana Lopez',
        memberType: 'resident',
        role: 'presidente',
        document: '1712345678',
        email: 'ana.lopez@correo.com',
        phone: '0999999999',
        periodStart: '2026-01-01',
        periodEnd: '2026-12-31',
        status: 'vigente',
        notes: 'Presidencia principal de la directiva actual.',
      },
      {
        id: 12,
        residentId: 102,
        fullName: 'Carlos Rivera',
        memberType: 'resident',
        role: 'secretario',
        document: '1709876543',
        email: 'carlos.rivera@correo.com',
        phone: '0988888888',
        periodStart: '2026-01-01',
        periodEnd: '2026-12-31',
        status: 'vigente',
        notes: 'Encargado de actas y seguimiento.',
      },
      {
        id: 13,
        residentId: null,
        fullName: 'Laura Torres',
        memberType: 'external',
        role: 'contadora',
        document: '1722334455',
        email: 'laura.torres@firma.com',
        phone: '0977777777',
        periodStart: '2026-01-01',
        periodEnd: '2026-12-31',
        status: 'vigente',
        notes: 'Contadora externa para soporte financiero.',
      },
    ],
  },
  {
    id: 2,
    title: 'Gestion 2025',
    periodStart: '2025-01-01',
    periodEnd: '2025-12-31',
    status: 'histórica',
    notes: 'Gestion cerrada y archivada para consulta.',
    members: [
      {
        id: 21,
        residentId: 103,
        fullName: 'Maria Sanchez',
        memberType: 'resident',
        role: 'tesorero',
        document: '1711199933',
        email: 'maria.sanchez@correo.com',
        phone: '0955555555',
        periodStart: '2025-01-01',
        periodEnd: '2025-12-31',
        status: 'histórica',
        notes: 'Gestion anterior cerrada correctamente.',
      },
    ],
  },
  {
    id: 3,
    title: 'Gestion 2024',
    periodStart: '2024-01-01',
    periodEnd: '2024-12-31',
    status: 'histórica',
    notes: 'Gestion historica de referencia.',
    members: [
      {
        id: 31,
        residentId: 104,
        fullName: 'Luis Herrera',
        memberType: 'resident',
        role: 'vocal',
        document: '1700445566',
        email: 'luis.herrera@correo.com',
        phone: '0944444444',
        periodStart: '2024-01-01',
        periodEnd: '2024-12-31',
        status: 'histórica',
        notes: 'Registro historico de la directiva.',
      },
    ],
  },
]);

const condominiumId = computed(() => String(route.params.id || ''));

const memberColumns: QTableColumn<CondominiumDirectiveMember>[] = [
  { name: 'fullName', label: 'Miembro', field: 'fullName', align: 'left', sortable: true },
  { name: 'role', label: 'Cargo', field: 'role', align: 'left', sortable: true },
  { name: 'document', label: 'Documento', field: 'document', align: 'left', sortable: true },
  { name: 'status', label: 'Estado', field: 'status', align: 'left', sortable: true },
  { name: 'actions', label: 'Acciones', field: 'id', align: 'right' },
];

const roleLabels: Record<string, string> = {
  presidente: 'Presidente',
  vicepresidente: 'Vicepresidente',
  secretario: 'Secretario',
  tesorero: 'Tesorero',
  vocal: 'Vocal',
  contadora: 'Contadora',
};

const selectedPeriod = computed(() => {
  if (selectedPeriodId.value !== null) {
    return periods.value.find((period) => period.id === selectedPeriodId.value) || periods.value[0] || null;
  }

  return periods.value[0] || null;
});
const selectedPeriodMembers = computed(() => selectedPeriod.value?.members || []);
const selectedPeriodResidentCount = computed(() =>
  selectedPeriodMembers.value.filter((member) => member.memberType === 'resident').length,
);
const selectedPeriodExternalCount = computed(() =>
  selectedPeriodMembers.value.filter((member) => member.memberType === 'external').length,
);

const selectedRoleNames = computed(() => ({
  president: selectedPeriodMembers.value.find((member) => member.role === 'presidente')?.fullName || 'Sin asignar',
  secretary: selectedPeriodMembers.value.find((member) => member.role === 'secretario')?.fullName || 'Sin asignar',
  treasurer: selectedPeriodMembers.value.find((member) => member.role === 'tesorero')?.fullName || 'Sin asignar',
  vocal: selectedPeriodMembers.value.find((member) => member.role === 'vocal')?.fullName || 'Sin asignar',
}));

const activePeriods = computed(() => periods.value.filter((period) => period.status === 'vigente').length);
const closedPeriods = computed(() => periods.value.filter((period) => period.status === 'histórica').length);

const stats = computed(() => [
  { label: 'Gestiones', value: String(periods.value.length), icon: 'event', color: 'primary' },
  { label: 'Vigentes', value: String(activePeriods.value), icon: 'verified', color: 'positive' },
  { label: 'Cerradas', value: String(closedPeriods.value), icon: 'history', color: 'secondary' },
  { label: 'Miembros actuales', value: String(selectedPeriodMembers.value.length), icon: 'groups', color: 'accent' },
]);

const selectedPeriodLabel = computed(() => selectedPeriod.value?.title || 'Sin seleccion');

function countMembersByType(
  members: CondominiumDirectiveMember[],
  memberType: CondominiumDirectiveMemberType,
) {
  return members.filter((member) => member.memberType === memberType).length;
}

const filteredPeriods = computed(() => {
  const term = filter.value.trim().toLowerCase();

  if (!term) {
    return periods.value.map(enrichPeriod);
  }

  return periods.value
    .filter((period) =>
      [period.title, period.periodStart, period.periodEnd, period.status, period.notes, ...period.members.map((member) => member.fullName)]
        .join(' ')
        .toLowerCase()
        .includes(term),
    )
    .map(enrichPeriod);
});

const filteredMembers = computed(() => {
  const term = memberFilter.value.trim().toLowerCase();
  const members = selectedPeriodMembers.value;

  if (!term) {
    return members.map(enrichMember);
  }

  return members
    .filter((member) =>
      [member.fullName, member.role, member.document, member.memberType, member.status, member.notes]
        .join(' ')
        .toLowerCase()
        .includes(term),
    )
    .map(enrichMember);
});

function enrichPeriod(period: CondominiumDirectivePeriod) {
  return period;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function getStatusColor(status: CondominiumDirectiveStatus) {
  if (status === 'vigente') {
    return 'positive';
  }

  if (status === 'pendiente') {
    return 'warning';
  }

  return 'grey';
}

function statusColor(status: CondominiumDirectiveStatus) {
  return getStatusColor(status);
}

function statusLabel(status: CondominiumDirectiveStatus) {
  return status === 'histórica' ? 'Historica' : status === 'vigente' ? 'Vigente' : 'Pendiente';
}

function enrichMember(member: CondominiumDirectiveMember) {
  return {
    ...member,
    initials: getInitials(member.fullName) || 'MI',
    memberTypeLabel: member.memberType === 'resident' ? 'Residente' : 'Externo',
    roleLabel: roleLabels[member.role] || member.role,
    statusLabel: statusLabel(member.status),
    statusColor: getStatusColor(member.status),
  };
}

async function loadCondominium() {
  condominiumLoading.value = true;
  pageError.value = '';

  try {
    const response = await getAdminCondominiumById(condominiumId.value);
    condominium.value = response ? toCondominiumDetails(response) : null;

    if (!condominium.value) {
      pageError.value = 'No se encontro el condominio seleccionado.';
    }
  } catch (exception) {
    pageError.value = exception instanceof Error ? exception.message : 'No se pudo cargar el condominio';
  } finally {
    condominiumLoading.value = false;
  }
}

function toNumber(value: number | string | undefined, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getStatusName(status: AdminCondominiumResponse['status']) {
  if (status && typeof status === 'object') {
    return status.name || String(status.id || 'Activo');
  }

  return status !== undefined && status !== null && status !== '' ? String(status) : 'Activo';
}

function getInitialsFromName(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function toCondominiumDetails(response: AdminCondominiumResponse): CondominiumDetails {
  const name = response.name || 'Condominio';

  return {
    id: toNumber(response.id),
    initials: getInitialsFromName(name) || 'CO',
    name,
    address: response.address || 'Sin direccion registrada',
    city: response.city || 'Sin ciudad',
    administrator:
      response.administrator_name ||
      response.administrator ||
      response.admin_name ||
      'Sin administrador',
    units: toNumber(
      response.total_houses ??
        response.total_homes ??
        response.total_casas ??
        response.houses_count ??
        response.units ??
        response.total_units,
    ),
    occupancy: toNumber(response.occupancy_percentage ?? response.occupancy),
    revenue:
      response.revenue !== undefined
        ? String(response.revenue)
        : String(response.monthly_revenue || '-'),
    status: getStatusName(response.status),
    statusColor: 'positive',
    updatedAt: response.updatedAt || response.updated_at || 'Sin actualizar',
  };
}

async function loadPage() {
  await loadCondominium();
}

function selectPeriod(period: CondominiumDirectivePeriod) {
  selectedPeriodId.value = period.id;
  memberFilter.value = '';
}

function openCreatePeriod() {
  selectedPeriodToEdit.value = null;
  periodError.value = '';
  showPeriodDialog.value = true;
}

function openEditPeriod(period: CondominiumDirectivePeriod) {
  selectedPeriodToEdit.value = period;
  selectedPeriodId.value = period.id;
  periodError.value = '';
  showPeriodDialog.value = true;
}

function submitPeriod(form: CondominiumDirectivePeriodForm) {
  savingPeriod.value = true;
  periodError.value = '';

  try {
    const nextPeriod: CondominiumDirectivePeriod = {
      id: selectedPeriodToEdit.value?.id || Date.now(),
      title: form.title,
      periodStart: form.periodStart,
      periodEnd: form.periodEnd,
      status: form.status,
      notes: form.notes,
      members: selectedPeriodToEdit.value?.members || [],
    };

    if (selectedPeriodToEdit.value) {
      periods.value = periods.value.map((period) =>
        period.id === selectedPeriodToEdit.value?.id ? nextPeriod : period,
      );
    } else {
      periods.value = [nextPeriod, ...periods.value];
      selectedPeriodId.value = nextPeriod.id;
    }

    showPeriodDialog.value = false;
    selectedPeriodToEdit.value = null;
    $q.notify({
      type: 'positive',
      message: 'Gestion guardada correctamente.',
      position: 'bottom',
    });
  } catch (exception) {
    periodError.value = exception instanceof Error ? exception.message : 'No se pudo guardar la gestion';
  } finally {
    savingPeriod.value = false;
  }
}

function openCreateMember() {
  if (!selectedPeriod.value) {
    return;
  }

  selectedMember.value = null;
  memberError.value = '';
  showMemberDialog.value = true;
}

function openEditMember(member: CondominiumDirectiveMember) {
  selectedMember.value = member;
  memberError.value = '';
  showMemberDialog.value = true;
}

function submitMember(form: CondominiumDirectiveForm) {
  if (!selectedPeriod.value) {
    return;
  }

  savingMember.value = true;
  memberError.value = '';

  try {
    const nextMember: CondominiumDirectiveMember = {
      id: selectedMember.value?.id || Date.now(),
      residentId: form.memberType === 'resident' ? form.residentId : null,
      fullName:
        form.memberType === 'resident'
          ? residentOptions.value.find((option) => option.value === form.residentId)?.label || 'Residente'
          : form.fullName,
      memberType: form.memberType,
      role: form.role,
      document: form.document || 'Sin documento',
      email: form.email || 'Sin correo',
      phone: form.phone || 'Sin telefono',
      periodStart: form.periodStart,
      periodEnd: form.periodEnd,
      status: form.status,
      notes:
        form.memberType === 'external'
          ? `${form.company ? `${form.company}. ` : ''}${form.notes}`.trim()
          : form.notes,
    };

    periods.value = periods.value.map((period) => {
      if (period.id !== selectedPeriod.value?.id) {
        return period;
      }

      const nextMembers = selectedMember.value
        ? period.members.map((member) => (member.id === selectedMember.value?.id ? nextMember : member))
        : [nextMember, ...period.members];

      return { ...period, members: nextMembers };
    });

    showMemberDialog.value = false;
    selectedMember.value = null;
    $q.notify({
      type: 'positive',
      message: 'Miembro guardado en la gestion.',
      position: 'bottom',
    });
  } catch (exception) {
    memberError.value = exception instanceof Error ? exception.message : 'No se pudo guardar el miembro';
  } finally {
    savingMember.value = false;
  }
}

function deleteMember(member: CondominiumDirectiveMember) {
  memberToDelete.value = member;
  showDeleteDialog.value = true;
}

function deleteSelectedMember() {
  if (!memberToDelete.value || !selectedPeriod.value) {
    return;
  }

  periods.value = periods.value.map((period) => {
    if (period.id !== selectedPeriod.value?.id) {
      return period;
    }

    return {
      ...period,
      members: period.members.filter((member) => member.id !== memberToDelete.value?.id),
    };
  });

  memberToDelete.value = null;
  showDeleteDialog.value = false;
}

const deleteDialogMessage = computed(() =>
  memberToDelete.value
    ? `¿Deseas dar de baja a ${memberToDelete.value.fullName}? Esta accion no se puede deshacer.`
    : '¿Deseas dar de baja este miembro? Esta accion no se puede deshacer.',
);

onMounted(() => {
  void loadPage();
});
</script>

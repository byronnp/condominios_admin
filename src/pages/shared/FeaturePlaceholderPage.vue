<template>
  <q-page class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">{{ eyebrow }}</p>
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
      </div>

      <div class="heading-actions">
        <q-btn
          outline
          color="primary"
          icon="arrow_back"
          label="Volver"
          to="/"
          no-caps
        />
        <q-btn
          v-if="actionLabel && actionTo"
          color="primary"
          :icon="actionIcon || 'open_in_new'"
          :label="actionLabel"
          no-caps
          :to="actionTo"
        />
      </div>
    </section>

    <section class="panel panel--placeholder">
      <div class="empty-state">
        <q-icon :name="icon" />
        <strong>{{ title }}</strong>
        <p>{{ emptyMessage }}</p>
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow: string;
    title: string;
    description: string;
    icon: string;
    emptyMessage?: string;
    actionLabel?: string;
    actionTo?: string;
    actionIcon?: string;
  }>(),
  {
    emptyMessage: 'Este modulo todavia no tiene una pantalla operativa completa.',
    actionLabel: '',
    actionTo: '',
    actionIcon: '',
  },
);
</script>

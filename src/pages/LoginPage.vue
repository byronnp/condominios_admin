<template>
  <main class="auth-page">
    <section class="auth-visual">
      <div class="auth-visual__content">
        <div class="brand-mark brand-mark--large">CA</div>
        <p class="eyebrow">Administracion residencial</p>
        <h1>Gestion y administracion de condominios</h1>
        <p>
          Accesos por rol, informacion relevante al entrar y flujos pensados para resolver tareas
          frecuentes con pocos pasos.
        </p>
      </div>
    </section>

    <section class="auth-panel">
      <q-form class="login-card" @submit.prevent="submitLogin">
        <div class="login-card__header">
          <p class="eyebrow">Ingreso seguro</p>
          <h2>Iniciar sesion</h2>
          <p>Usa tu correo y contrasena para acceder a tu panel.</p>
        </div>

        <q-input
          v-model="email"
          outlined
          dense
          class="auth-input"
          label="Correo electronico"
          type="email"
          autocomplete="email"
          :rules="[(value) => !!value || 'Ingresa tu correo']"
        >
          <template #prepend>
            <q-icon name="alternate_email" />
          </template>
        </q-input>

        <q-input
          v-model="password"
          outlined
          dense
          class="auth-input"
          label="Contrasena"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          :rules="[(value) => !!value || 'Ingresa tu contrasena']"
        >
          <template #prepend>
            <q-icon name="lock" />
          </template>
          <template #append>
            <q-btn
              flat
              dense
              round
              :icon="showPassword ? 'visibility_off' : 'visibility'"
              aria-label="Mostrar u ocultar contrasena"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>

        <div class="login-card__meta">
          <q-checkbox v-model="rememberSession" label="Recordar sesion" dense />
          <q-btn
            flat
            dense
            no-caps
            color="primary"
            label="Olvide mi contrasena"
            class="auth-link-btn"
          />
        </div>

        <q-banner v-if="authError" dense rounded class="auth-error">
          {{ authError }}
        </q-banner>

        <q-btn
          type="submit"
          color="primary"
          unelevated
          no-caps
          icon-right="arrow_forward"
          label="Entrar al dashboard"
          class="auth-submit-btn full-width"
          :loading="loading"
        />
      </q-form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { loading, error: authError, signIn } = useAuth();
const email = ref('admin@condominios.test');
const password = ref('admin123');
const showPassword = ref(false);
const rememberSession = ref(true);

async function submitLogin() {
  try {
    await signIn({
      email: email.value,
      password: password.value,
    });
    void router.push('/');
  } catch {
    // The composable exposes the message for the template.
  }
}
</script>

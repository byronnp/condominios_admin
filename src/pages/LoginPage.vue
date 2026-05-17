<template>
  <main class="auth-page">
    <section class="auth-visual">
      <div class="auth-visual__content">
        <div class="brand-mark brand-mark--large">CA</div>
        <p class="eyebrow">Administracion residencial</p>
        <h1>Gestion clara para administradores y condominos.</h1>
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
          <q-btn flat no-caps color="primary" label="Olvide mi contrasena" />
        </div>

        <q-btn
          type="submit"
          color="primary"
          unelevated
          no-caps
          size="lg"
          icon-right="arrow_forward"
          label="Entrar al dashboard"
          class="full-width"
          :loading="isSubmitting"
        />
      </q-form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

type UserRole = 'super-admin' | 'condo-admin' | 'resident';

const router = useRouter();
const email = ref('admin@condominios.com');
const password = ref('123456');
const showPassword = ref(false);
const rememberSession = ref(true);
const isSubmitting = ref(false);

function submitLogin() {
  isSubmitting.value = true;

  window.setTimeout(() => {
    window.localStorage.setItem('condominios-role', resolveDemoRole(email.value));
    isSubmitting.value = false;
    void router.push('/');
  }, 450);
}

function resolveDemoRole(userEmail: string): UserRole {
  const normalizedEmail = userEmail.trim().toLowerCase();

  if (normalizedEmail.includes('super')) {
    return 'super-admin';
  }

  if (normalizedEmail.includes('condomino') || normalizedEmail.includes('residente')) {
    return 'resident';
  }

  return 'condo-admin';
}
</script>

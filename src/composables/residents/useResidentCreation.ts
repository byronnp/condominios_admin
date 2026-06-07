import { ref } from 'vue';
import type { CreateResidentPayload } from '../../interfaces/residents/resident-form.interface';
import { createAdminResident } from '../../services/residents/residents.service';

export function useResidentCreation() {
  const loading = ref(false);
  const error = ref('');
  const createdResident = ref<unknown>(null);

  async function createResident(payload: CreateResidentPayload) {
    loading.value = true;
    error.value = '';

    try {
      const response = await createAdminResident(payload);
      createdResident.value = response;
      return response;
    } catch (exception) {
      error.value =
        exception instanceof Error ? exception.message : 'No se pudo crear el residente';
      createdResident.value = null;
      throw exception;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    createdResident,
    createResident,
  };
}

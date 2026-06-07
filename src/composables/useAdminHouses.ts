import { ref } from 'vue';
import { normalizeHouse } from './house-mappers';
import type { House } from '../interfaces/houses/house.interface';
import { getAdminHouses } from '../services/houses.service';

export function useAdminHouses() {
  const houses = ref<House[]>([]);
  const loading = ref(false);
  const error = ref('');

  async function loadHouses() {
    loading.value = true;
    error.value = '';

    try {
      const response = await getAdminHouses();
      houses.value = response.map(normalizeHouse);
    } catch (exception) {
      error.value = exception instanceof Error ? exception.message : 'No se pudieron cargar las casas';
      houses.value = [];
    } finally {
      loading.value = false;
    }
  }

  return {
    houses,
    loading,
    error,
    loadHouses,
  };
}

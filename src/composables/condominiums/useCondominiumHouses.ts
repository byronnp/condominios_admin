import { ref } from 'vue';
import type { House } from '../../interfaces/houses/house.interface';
import { normalizeHouse } from '../houses/house-mappers';
import { getAdminHouses } from '../../services/houses/houses.service';

export function useCondominiumHouses() {
  const houses = ref<House[]>([]);
  const loading = ref(false);
  const error = ref('');

  async function loadHouses(condominiumId: number | string) {
    loading.value = true;
    error.value = '';

    try {
      const response = await getAdminHouses(condominiumId);
      const id = Number(condominiumId);
      houses.value = response.map(normalizeHouse).filter((house) => house.condominiumId === id);
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

import { ref } from 'vue';
import type { CatalogItem } from '../interfaces/shared/catalog.interface';
import { getAdminCatalogItems } from '../services/catalogs.service';

export function useCatalog(catalogId: string) {
  const items = ref<CatalogItem[]>([]);
  const loading = ref(false);
  const error = ref('');

  async function loadCatalog() {
    loading.value = true;
    error.value = '';

    try {
      items.value = await getAdminCatalogItems(catalogId);
    } catch (exception) {
      error.value = exception instanceof Error ? exception.message : 'No se pudo cargar el catalogo';
      items.value = [];
    } finally {
      loading.value = false;
    }
  }

  return {
    items,
    loading,
    error,
    loadCatalog,
  };
}

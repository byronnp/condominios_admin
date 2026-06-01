import type { CatalogItem, CatalogResponse } from '../interfaces/shared/catalog.interface';
import { apiGet } from './api.service';

function isCatalogItemArray(value: unknown): value is CatalogItem[] {
  return Array.isArray(value);
}

function normalizeCatalogItems(items: CatalogItem[]) {
  return items.map((item) => ({
    id: String(item.id),
    name: item.name,
  }));
}

export async function getAdminCatalogItems(catalogId: string) {
  const response = await apiGet<unknown>(`admin/catalogs/${catalogId}`);

  if (isCatalogItemArray(response)) {
    return normalizeCatalogItems(response);
  }

  const payload = response as CatalogResponse;

  if (isCatalogItemArray(payload.items)) {
    return normalizeCatalogItems(payload.items);
  }

  if (isCatalogItemArray(payload.data)) {
    return normalizeCatalogItems(payload.data);
  }

  return normalizeCatalogItems(payload.data?.items || []);
}

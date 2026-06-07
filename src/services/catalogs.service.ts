import type { CatalogItem, CatalogResponse } from '../interfaces/shared/catalog.interface';
import { apiGet } from './api.service';

function isCatalogItemArray(value: unknown): value is CatalogItem[] {
  return Array.isArray(value);
}

function normalizeCatalogItems(items: CatalogItem[]) {
  return items.map((item) => {
    const normalized: {
      id: string;
      name: string;
      value?: number | string;
      label?: string;
      sort_order?: number | string;
    } = {
      id: String(item.id ?? item.value ?? ''),
      name: item.name ?? item.label ?? '',
    };

    if (item.value !== undefined) {
      normalized.value = item.value;
    } else if (item.id !== undefined) {
      normalized.value = item.id;
    }

    if (item.label !== undefined) {
      normalized.label = item.label;
    } else if (item.name !== undefined) {
      normalized.label = item.name;
    }

    if (item.sort_order !== undefined) {
      normalized.sort_order = item.sort_order;
    }

    return normalized;
  });
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

export interface CatalogItem {
  id?: string;
  name?: string;
  value?: number | string;
  label?: string;
  sort_order?: number | string;
}

export interface CatalogResponse {
  success?: boolean;
  message?: string;
  data?:
    | CatalogItem[]
    | {
        items?: CatalogItem[];
      };
  items?: CatalogItem[];
}

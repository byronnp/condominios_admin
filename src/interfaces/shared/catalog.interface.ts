export interface CatalogItem {
  id: string;
  name: string;
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

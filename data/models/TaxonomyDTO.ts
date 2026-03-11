export interface CategoryDTO {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  icon_url?: string;
  is_leaf: boolean;
  parent_id?: number;
  children?: CategoryDTO[];
}

export interface AttributeDTO {
  id: number;
  key: string;
  label: string;
  type: string;
  options?: string[];
  required?: boolean;
  order?: number;
}

export interface LocationDTO {
  id: number;
  name: string;
  name_ru?: string;
  name_uz?: string;
  slug: string;
  kind?: string;
  lat?: number;
  lon?: number;
  has_children?: boolean;
  parent?: number;
  children?: LocationDTO[];
}

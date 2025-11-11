export interface CategoryDTO {
  id: number;
  name: string;
  slug: string;
  icon?: string;
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
  slug: string;
  parent_id?: number;
  level?: number;
  children?: LocationDTO[];
}

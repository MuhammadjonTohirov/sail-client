"use client";

export type Hit = {
  id: string;
  title: string;
  price?: number;
  currency?: string;
  media_urls?: string[];
  location_name_ru?: string;
  location_name_uz?: string;
  refreshed_at?: string;
};

export type CategoryNode = {
  id: number;
  name: string;
  slug: string;
  is_leaf: boolean;
  icon?: string;
  children?: CategoryNode[];
};

export type Attr = {
  id: number;
  key: string;
  label: string;
  type: string;
  options?: string[];
};

export type SearchPrefillValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean>;

export type SearchPrefill = Record<string, SearchPrefillValue>;

export type CategorySummary = {
  id: number;
  slug: string;
  name: string;
};

export type AttributePrefillEntry = {
  values?: string[];
  rangeMin?: string;
  rangeMax?: string;
};

export type AttributePrefillMap = Record<string, AttributePrefillEntry>;

export type SearchParamsLike = Pick<URLSearchParams, 'forEach'>;

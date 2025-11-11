"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { appConfig } from '@/config';
import { SearchInteractor } from './SearchInteractor';
import {
  Attr,
  AttributePrefillEntry,
  AttributePrefillMap,
  CategoryNode,
  CategorySummary,
  Hit,
  SearchParamsLike,
  SearchPrefill,
  SearchPrefillValue,
} from './types';
import { SearchListing } from '@/domain/models/SearchListing';

const ATTR_PREFIX = 'attrs.';

const toSingleValue = (value: SearchPrefillValue, fallback = ''): string => {
  if (Array.isArray(value)) return value.length ? String(value[0]) : fallback;
  if (value === null || value === undefined) return fallback;
  return String(value);
};

const toArrayValue = (value: SearchPrefillValue): string[] => {
  if (Array.isArray(value)) return value.map((v) => String(v));
  if (value === null || value === undefined) return [];
  return [String(value)];
};

const mergePrefillSources = (sp: SearchParamsLike, overrides?: SearchPrefill): SearchPrefill => {
  const base: SearchPrefill = {};
  sp.forEach((value, key) => {
    if (base[key] === undefined) {
      base[key] = value;
    } else {
      const existing = base[key];
      base[key] = Array.isArray(existing) ? [...existing, value] : [existing as string | number | boolean, value];
    }
  });
  if (overrides) {
    Object.entries(overrides).forEach(([key, value]) => {
      base[key] = value;
    });
  }
  return base;
};

const parseAttributePrefill = (source: SearchPrefill): AttributePrefillMap => {
  const result: AttributePrefillMap = {};
  Object.entries(source).forEach(([key, raw]) => {
    if (!key.startsWith(ATTR_PREFIX) || raw === undefined || raw === null) return;
    const attrKeyWithSuffix = key.slice(ATTR_PREFIX.length);
    if (attrKeyWithSuffix.endsWith('_min')) {
      const baseKey = attrKeyWithSuffix.slice(0, -4);
      result[baseKey] = {
        ...(result[baseKey] || {}),
        rangeMin: toSingleValue(raw),
      };
      return;
    }
    if (attrKeyWithSuffix.endsWith('_max')) {
      const baseKey = attrKeyWithSuffix.slice(0, -4);
      result[baseKey] = {
        ...(result[baseKey] || {}),
        rangeMax: toSingleValue(raw),
      };
      return;
    }
    const attrKey = attrKeyWithSuffix;
    const values = toArrayValue(raw).filter((v) => v !== '');
    result[attrKey] = {
      ...(result[attrKey] || {}),
      values,
    };
  });
  return result;
};

const convertAttributePrefill = (entry: AttributePrefillEntry | undefined, attr: Attr) => {
  if (!entry) return undefined;
  switch (attr.type) {
    case 'multiselect':
      return entry.values || [];
    case 'select':
    case 'text':
      return entry.values?.[0] ?? '';
    case 'number':
    case 'range': {
      const min = entry.rangeMin ?? entry.values?.[0] ?? '';
      const max = entry.rangeMax ?? entry.values?.[1] ?? '';
      return [min, max];
    }
    case 'boolean': {
      const raw = entry.values?.[0];
      if (raw === undefined) return false;
      if (raw === 'true' || raw === '1') return true;
      if (raw === 'false' || raw === '0') return false;
      return Boolean(raw);
    }
    default:
      return entry.values?.[0] ?? '';
  }
};

const shallowEqual = (a: any, b: any) => {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i += 1) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  return a === b;
};

const isAttrValueEmpty = (value: any) => {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value === '';
  if (Array.isArray(value)) {
    if (value.length === 0) return true;
    return value.every((v) => v === '' || v === undefined || v === null);
  }
  return false;
};

const buildFlatCategories = (nodes: CategoryNode[]): CategorySummary[] => {
  const arr: CategorySummary[] = [];
  const walk = (list: CategoryNode[], prefix: string[]) => {
    list.forEach((node) => {
      arr.push({ id: node.id, slug: node.slug, name: [...prefix, node.name].join(' / ') });
      if (node.children?.length) walk(node.children, [...prefix, node.name]);
    });
  };
  walk(nodes, []);
  return arr;
};

export interface SearchViewModel {
  locale: string;
  basePath: string;
  q: string;
  setQ: (value: string) => void;
  minPrice: string;
  setMinPrice: (value: string) => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  categoryTree: CategoryNode[];
  selectedCategory: { id: number; slug: string } | null;
  selectedCategoryPath: string;
  attributes: Attr[];
  attrValues: Record<string, any>;
  results: SearchListing[];
  total: number;
  loading: boolean;
  runSearch: () => Promise<void> | void;
  saveCurrentSearch: () => Promise<void> | void;
  selectCategoryFromPicker: (payload: { id: number; path: string }) => void;
  resetFilters: () => void;
  setAttrValue: (key: string, value: any) => void;
}

export function useSearchViewModel(initialFilters?: SearchPrefill): SearchViewModel {
  const { locale } = useI18n();
  const basePath = '';
  const router = useRouter();
  const searchParams = useSearchParams();
  const interactorRef = useRef(new SearchInteractor());
  const { features, pagination } = appConfig;
  const perPage = pagination.itemsPerPage;

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<{ id: number; slug: string } | null>(null);
  const [selectedCategoryPath, setSelectedCategoryPath] = useState('');
  const [attributes, setAttributes] = useState<Attr[]>([]);
  const [attrValues, setAttrValues] = useState<Record<string, any>>({});
  const [results, setResults] = useState<SearchListing[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [prefillOverride, setPrefillOverride] = useState<SearchPrefill | undefined>(initialFilters);
  const [prefillSignature, setPrefillSignature] = useState(() => (initialFilters ? JSON.stringify(initialFilters) : ''));
  const mergedPrefill = useMemo(() => mergePrefillSources(searchParams, prefillOverride), [searchParams, prefillOverride]);
  const attributePrefill = useMemo(() => parseAttributePrefill(mergedPrefill), [mergedPrefill]);

  const [q, setQ] = useState(() => toSingleValue(mergedPrefill.q, ''));
  const [minPrice, setMinPrice] = useState(() => toSingleValue(mergedPrefill.min_price, ''));
  const [maxPrice, setMaxPrice] = useState(() => toSingleValue(mergedPrefill.max_price, ''));
  const [sort, setSort] = useState(() => toSingleValue(mergedPrefill.sort, '') || 'relevance');
  const [categorySlug, setCategorySlug] = useState(() => toSingleValue(mergedPrefill.category_slug, ''));

  const runRef = useRef<() => Promise<void> | void>();
  const hasHandledPrefill = useRef(false);
  const attrPrefillNeedsRun = useRef(false);

  useEffect(() => {
    const nextSignature = initialFilters ? JSON.stringify(initialFilters) : '';
    if (nextSignature !== prefillSignature) {
      setPrefillSignature(nextSignature);
      setPrefillOverride(initialFilters);
    }
  }, [initialFilters, prefillSignature]);

  useEffect(() => {
    setQ(toSingleValue(mergedPrefill.q, ''));
    setMinPrice(toSingleValue(mergedPrefill.min_price, ''));
    setMaxPrice(toSingleValue(mergedPrefill.max_price, ''));
    setSort(toSingleValue(mergedPrefill.sort, '') || 'relevance');
    setCategorySlug(toSingleValue(mergedPrefill.category_slug, ''));
  }, [mergedPrefill]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const tree = await interactorRef.current.fetchCategoryTree();
      if (!cancelled) setCategoryTree(tree || []);
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!selectedCategory?.id) {
      setAttributes([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const attrs = await interactorRef.current.fetchCategoryAttributes(selectedCategory.id);
      if (!cancelled) setAttributes(attrs || []);
    })();
    return () => { cancelled = true; };
  }, [selectedCategory?.id]);

  const flatCategories = useMemo(() => buildFlatCategories(categoryTree), [categoryTree]);

  useEffect(() => {
    if (!categorySlug) {
      setSelectedCategory(null);
      setSelectedCategoryPath('');
      return;
    }
    const match = flatCategories.find((c) => c.slug === categorySlug);
    if (match) {
      setSelectedCategory((prev) => (prev?.id === match.id ? prev : { id: match.id, slug: match.slug }));
      setSelectedCategoryPath(match.name);
    } else {
      setSelectedCategory(null);
      setSelectedCategoryPath('');
    }
  }, [categorySlug, flatCategories]);

  useEffect(() => {
    if (!attributes.length) return;
    setAttrValues((prev) => {
      const next = { ...prev };
      let changed = false;
      attributes.forEach((attr) => {
        const entry = attributePrefill[attr.key];
        if (!entry) return;
        const converted = convertAttributePrefill(entry, attr);
        if (converted === undefined || shallowEqual(next[attr.key], converted)) return;
        next[attr.key] = converted;
        changed = true;
      });
      if (changed) {
        attrPrefillNeedsRun.current = true;
        return next;
      }
      return prev;
    });
  }, [attributes, attributePrefill]);

  const run = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { q, min_price: minPrice, max_price: maxPrice, sort, per_page: perPage };
      const effectiveCategorySlug = selectedCategory?.slug || categorySlug || '';
      if (effectiveCategorySlug) params.category_slug = effectiveCategorySlug;
      for (const attr of attributes) {
        const value = attrValues[attr.key];
        if (value === undefined || value === '' || value === null) continue;
        if (attr.type === 'multiselect' && Array.isArray(value)) {
          if (value.length) params[`attrs.${attr.key}`] = value;
        } else if (attr.type === 'number' || attr.type === 'range') {
          const [min, max] = Array.isArray(value) ? value : [value, undefined];
          if (min !== undefined && min !== '') params[`attrs.${attr.key}_min`] = min;
          if (max !== undefined && max !== '') params[`attrs.${attr.key}_max`] = max;
        } else {
          params[`attrs.${attr.key}`] = value;
        }
      }
      const data = await interactorRef.current.fetchListings(params);
      setResults(data.results || []);
      setTotal(data.total || 0);

      const usp = new URLSearchParams();
      if (q) usp.set('q', q);
      if (minPrice) usp.set('min_price', String(minPrice));
      if (maxPrice) usp.set('max_price', String(maxPrice));
      if (effectiveCategorySlug) usp.set('category_slug', effectiveCategorySlug);
      if (sort && sort !== 'relevance') usp.set('sort', sort);
      router.replace(`${basePath}/search?${usp.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  runRef.current = run;

  useEffect(() => {
    if (!hasHandledPrefill.current) {
      hasHandledPrefill.current = true;
      return;
    }
    runRef.current?.();
  }, [prefillSignature]);

  useEffect(() => {
    if (!attrPrefillNeedsRun.current) return;
    attrPrefillNeedsRun.current = false;
    runRef.current?.();
  }, [attrValues]);

  useEffect(() => {
    runRef.current?.();
  }, []);

  useEffect(() => {
    runRef.current?.();
  }, [sort]);

  const setAttrValue = useCallback((key: string, value: any) => {
    setAttrValues((prev) => {
      if (isAttrValueEmpty(value)) {
        if (prev[key] === undefined) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      }
      if (shallowEqual(prev[key], value)) return prev;
      return { ...prev, [key]: value };
    });
  }, []);

  const selectCategoryFromPicker = useCallback((payload: { id: number; path: string }) => {
    const slug = flatCategories.find((c) => c.id === payload.id)?.slug || '';
    setSelectedCategory({ id: payload.id, slug });
    setSelectedCategoryPath(payload.path);
    setCategorySlug(slug);
    setTimeout(() => runRef.current?.(), 0);
  }, [flatCategories]);

  const resetFilters = useCallback(() => {
    setSelectedCategory(null);
    setSelectedCategoryPath('');
    setCategorySlug('');
    setMinPrice('');
    setMaxPrice('');
    setAttrValues({});
    setTimeout(() => runRef.current?.(), 0);
  }, []);

  const saveCurrentSearch = useCallback(async () => {
    if (!features.enableSavedSearches) return;
    const effectiveCategorySlug = selectedCategory?.slug || categorySlug || '';
    const title = selectedCategoryPath || q || (locale === 'uz' ? 'Qidiruv' : 'Поиск');

    // Build attributes params for saving
    const attributesParams: Record<string, any> = {};
    for (const attr of attributes) {
      const value = attrValues[attr.key];
      if (value === undefined || value === '' || value === null) continue;
      if (attr.type === 'multiselect' && Array.isArray(value)) {
        if (value.length) attributesParams[`attrs.${attr.key}`] = value;
      } else if (attr.type === 'number' || attr.type === 'range') {
        const [min, max] = Array.isArray(value) ? value : [value, undefined];
        if (min !== undefined && min !== '') attributesParams[`attrs.${attr.key}_min`] = min;
        if (max !== undefined && max !== '') attributesParams[`attrs.${attr.key}_max`] = max;
      } else {
        attributesParams[`attrs.${attr.key}`] = value;
      }
    }

    const query = {
      params: {
        q,
        min_price: minPrice,
        max_price: maxPrice,
        ...(effectiveCategorySlug ? { category_slug: effectiveCategorySlug } : {}),
        ...attributesParams,
      },
      category_name: selectedCategoryPath,
      location_name: searchParams.get('location_name') || undefined,
      price_min: minPrice ? Number(minPrice) : undefined,
      price_max: maxPrice ? Number(maxPrice) : undefined,
    };
    try {
      await interactorRef.current.saveSearch({ title, query });
      alert(locale === 'uz' ? 'Qidiruv saqlandi' : 'Поиск сохранен');
    } catch {
      alert(locale === 'uz' ? 'Xatolik yuz berdi' : 'Ошибка при сохранении');
    }
  }, [features.enableSavedSearches, selectedCategory?.slug, categorySlug, selectedCategoryPath, q, minPrice, maxPrice, locale, searchParams, attributes, attrValues]);

  return {
    locale,
    basePath,
    q,
    setQ,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    sort,
    setSort,
    viewMode,
    setViewMode,
    categoryTree,
    selectedCategory,
    selectedCategoryPath,
    attributes,
    attrValues,
    results,
    total,
    loading,
    runSearch: () => runRef.current?.(),
    saveCurrentSearch,
    selectCategoryFromPicker,
    resetFilters,
    setAttrValue,
  };
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import type { Attr } from '@/app/search/types';
import Dropdown from '@/components/ui/Dropdown';
import MultiDropdown from '@/components/ui/MultiDropdown';

interface SearchFiltersProps {
  selectedCategory: { id: number; slug: string } | null;
  minPrice: string;
  setMinPrice: (value: string) => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
  attributes: Attr[];
  attrValues: Record<string, any>;
  setAttrValue: (key: string, value: any) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
}

const MOBILE_QUERY = '(max-width: 768px)';

export default function SearchFilters({
  selectedCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  attributes,
  attrValues,
  setAttrValue,
  onResetFilters,
  onApplyFilters,
}: SearchFiltersProps) {
  
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia(MOBILE_QUERY);
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(event.matches);
    };

    handleChange(media);

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', handleChange);
      return () => media.removeEventListener('change', handleChange);
    }

    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile || !mobileOpen || typeof document === 'undefined') {
      return;
    }
    const { body } = document;
    const previous = body.style.overflow;
    body.style.overflow = 'hidden';
    return () => {
      body.style.overflow = previous;
    };
  }, [isMobile, mobileOpen]);

  const attrFilterCount = useMemo(() => {
    return Object.values(attrValues).reduce((acc, value) => {
      if (value === null || value === undefined) return acc;
      if (Array.isArray(value)) {
        const hasValue = value.some((v) => {
          if (v === null || v === undefined) return false;
          if (typeof v === 'string') return v.trim() !== '';
          return true;
        });
        return acc + (hasValue ? 1 : 0);
      }
      if (typeof value === 'string') {
        return acc + (value.trim() !== '' ? 1 : 0);
      }
      if (typeof value === 'boolean') {
        return acc + (value ? 1 : 0);
      }
      return acc + 1;
    }, 0);
  }, [attrValues]);

  const filtersCount = (selectedCategory ? 1 : 0) + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0) + attrFilterCount;
  const hasActiveFilters = filtersCount > 0;
  const { t } = useI18n();
  
  return (
    <aside className="search-filters card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold m-0" suppressHydrationWarning>
          {t('searchPage.filtersTitle')}
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            suppressHydrationWarning
            style={{height: '28px', alignItems: 'center', display: 'flex'}}
          >
            {t('searchPage.resetFilters')}
          </button>
        )}
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <label className="muted-small" suppressHydrationWarning>
            {t('searchPage.priceLabel')}
          </label>
          <div className="row">
            <input
              placeholder={t('searchPage.priceFrom')}
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              style={{width: `100%`, maxWidth: '120px'}}
              suppressHydrationWarning
            />
            <input
              placeholder={t('searchPage.priceTo')}
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              style={{width: `100%`, maxWidth: '120px'}}
              suppressHydrationWarning
            />
          </div>
        </div>

        {attributes.map((a) => {
          const attrValue = attrValues[a.key];
          const [attrMin, attrMax] = Array.isArray(attrValue) ? attrValue : ['', ''];

          return (
            <div key={a.id} className="filter-group">
              <label className="muted-small" suppressHydrationWarning>{a.label}</label>

              {a.type === 'select' && (
                <Dropdown
                  value={String(attrValue ?? '')}
                  onChange={(v) => setAttrValue(a.key, v)}
                  options={[
                    { value: '', label: t('') },
                    ...(a.options || []).map((o) => ({ value: String(o), label: String(o) })),
                  ]}
                  style={{
                    
                  }}
                />
              )}

              {a.type === 'multiselect' && (
                <MultiDropdown
                  value={Array.isArray(attrValue) ? attrValue.map(String) : []}
                  onChange={(v) => setAttrValue(a.key, v)}
                  options={(a.options || []).map((o) => ({ value: String(o), label: String(o) }))}
                />
              )}

              {(a.type === 'number' || a.type === 'range') && (
                <div className="row">
                  <input
                    placeholder={t('searchPage.rangeMin')}
                    value={attrMin ?? ''}
                    onChange={(e) => setAttrValue(a.key, [e.target.value, attrMax ?? ''])}
                    style={{width: `100%`, maxWidth: '120px'}}
                    suppressHydrationWarning
                  />
                  <input
                    placeholder={t('searchPage.rangeMax')}
                    value={attrMax ?? ''}
                    onChange={(e) => setAttrValue(a.key, [attrMin ?? '', e.target.value])}
                    style={{width: `100%`, maxWidth: '120px'}}
                    suppressHydrationWarning
                  />
                </div>
              )}

              {a.type === 'text' && (
                <input 
                  value={attrValue || ''} 
                  onChange={(e) => setAttrValue(a.key, e.target.value)} 
                  style={{width: `100%`, maxWidth: '120px'}}
                />
              )}

              {a.type === 'boolean' && (
                <label>
                  <input
                    type="checkbox"
                    checked={!!attrValue}
                    onChange={(e) => setAttrValue(a.key, e.target.checked)}
                    style={{width: `100%`, maxWidth: '120px'}}
                  />
                </label>
              )}
            </div>
          );
        })}
      </div>

      <button className="btn-accent" onClick={onApplyFilters} style={{ width: '100%', marginTop: '16px' }} suppressHydrationWarning>
        {t('searchPage.applyFilters')}
      </button>
    </aside>
  );
}

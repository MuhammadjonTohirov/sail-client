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
  const renderFiltersBody = () => (
    <>
      <div className="filter-group">
        <label className="muted" suppressHydrationWarning>
          {t('searchPage.priceLabel')}
        </label>
        <div className="row">
          <input
            placeholder={t('searchPage.priceFrom')}
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            suppressHydrationWarning
          />
          <input
            placeholder={t('searchPage.priceTo')}
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            suppressHydrationWarning
          />
        </div>
      </div>

      {attributes.map((a) => {
        const attrValue = attrValues[a.key];
        const [attrMin, attrMax] = Array.isArray(attrValue) ? attrValue : ['', ''];

        return (
          <div key={a.id} className="filter-group">
            <label className="muted" suppressHydrationWarning>{a.label}</label>

            {a.type === 'select' && (
              <Dropdown
                value={String(attrValue ?? '')}
                onChange={(v) => setAttrValue(a.key, v)}
                options={[
                  { value: '', label: '--' },
                  ...(a.options || []).map((o) => ({ value: String(o), label: String(o) })),
                ]}
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
                  suppressHydrationWarning
                />
                <input
                  placeholder={t('searchPage.rangeMax')}
                  value={attrMax ?? ''}
                  onChange={(e) => setAttrValue(a.key, [attrMin ?? '', e.target.value])}
                  suppressHydrationWarning
                />
              </div>
            )}

            {a.type === 'text' && (
              <input value={attrValue || ''} onChange={(e) => setAttrValue(a.key, e.target.value)} />
            )}

            {a.type === 'boolean' && (
              <label>
                <input
                  type="checkbox"
                  checked={!!attrValue}
                  onChange={(e) => setAttrValue(a.key, e.target.checked)}
                />
              </label>
            )}
          </div>
        );
      })}
    </>
  );

  const handleApplyAndClose = () => {
    onApplyFilters();
    setMobileOpen(false);
  };

  const handleResetAndClose = () => {
    onResetFilters();
    setMobileOpen(false);
  };

  if (isMobile) {
    return (
      <>
        <button
          type="button"
          className="filters-mobile-trigger card"
          onClick={() => setMobileOpen(true)}
        >
          <span suppressHydrationWarning>{t('searchPage.filtersTitle')}</span>
          {hasActiveFilters ? (
            <span className="filters-mobile-chip" suppressHydrationWarning>
              {t('searchPage.filtersApplied', { count: filtersCount })}
            </span>
          ) : (
            <svg viewBox="0 0 24 24" width={20} height={20} stroke="currentColor" fill="none" strokeWidth={1.8}>
              <path d="M4 7h16M4 12h10M4 17h6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {mobileOpen && (
          <div className="filters-sheet" role="dialog" aria-modal="true">
            <div className="filters-sheet__header">
              <button
                type="button"
                className="filters-sheet__back"
                onClick={() => setMobileOpen(false)}
                aria-label={t('searchPage.filtersBack')}
                suppressHydrationWarning
              >
                <p style={{color: '#000000'}}>←</p>
              </button>
              <h3 className="filters-sheet__title" suppressHydrationWarning>
                {t('searchPage.filtersTitle')}
              </h3>
              {hasActiveFilters && (
                <button
                  type="button"
                  className="filters-sheet__reset"
                  onClick={onResetFilters}
                  suppressHydrationWarning
                >
                  {t('searchPage.resetFilters')}
                </button>
              )}
            </div>

            <div className="filters-sheet__body">{renderFiltersBody()}</div>

            <div className="filters-sheet__footer">
              <button type="button" className="btn-outline" onClick={handleResetAndClose}>
                {t('searchPage.resetFilters')}
              </button>
              <button type="button" className="btn-accent" onClick={handleApplyAndClose}>
                {t('searchPage.applyFilters')}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

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

      {renderFiltersBody()}

      <button className="btn-accent" onClick={onApplyFilters} style={{ width: '100%' }} suppressHydrationWarning>
        {t('searchPage.applyFilters')}
      </button>
    </aside>
  );
}

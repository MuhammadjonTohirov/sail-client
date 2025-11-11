import { useI18n } from '@/lib/i18n';
import type { Attr } from '@/app/search/types';

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
  const { t } = useI18n();

  const hasActiveFilters = selectedCategory || minPrice || maxPrice || Object.keys(attrValues).length > 0;

  return (
    <aside className="search-filters card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold m-0">{t('searchPage.filtersTitle')}</h3>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-sm text-[#23E5DB] hover:text-[#1dd4cb]"
          >
            {t('searchPage.resetFilters')}
          </button>
        )}
      </div>

      <div className="filter-group">
        <label className="muted">{t('searchPage.priceLabel')}</label>
        <div className="row">
          <input
            placeholder={t('searchPage.priceFrom')}
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
          />
          <input
            placeholder={t('searchPage.priceTo')}
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      {attributes.map((a) => {
        const attrValue = attrValues[a.key];
        const [attrMin, attrMax] = Array.isArray(attrValue) ? attrValue : ['', ''];

        return (
          <div key={a.id} className="filter-group">
            <label className="muted">{a.label}</label>

            {a.type === 'select' && (
              <select value={attrValue || ''} onChange={(e) => setAttrValue(a.key, e.target.value)}>
                <option value="">--</option>
                {(a.options || []).map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            )}

            {a.type === 'multiselect' && (
              <select
                multiple
                value={attrValue || []}
                onChange={(e) => setAttrValue(a.key, Array.from(e.target.selectedOptions).map(option => option.value))}
              >
                {(a.options || []).map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            )}

            {(a.type === 'number' || a.type === 'range') && (
              <div className="row">
                <input
                  placeholder={t('searchPage.rangeMin')}
                  value={attrMin ?? ''}
                  onChange={(e) => setAttrValue(a.key, [e.target.value, attrMax ?? ''])}
                />
                <input
                  placeholder={t('searchPage.rangeMax')}
                  value={attrMax ?? ''}
                  onChange={(e) => setAttrValue(a.key, [attrMin ?? '', e.target.value])}
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

      <button className="btn-accent" onClick={onApplyFilters} style={{ width: '100%' }}>
        {t('searchPage.applyFilters')}
      </button>
    </aside>
  );
}

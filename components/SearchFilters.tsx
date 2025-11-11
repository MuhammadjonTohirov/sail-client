'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';

interface FilterOption {
  key: string;
  count: number;
}

interface PriceRange {
  min: number;
  max: number;
}

interface SearchFiltersProps {
  facets: {
    categories?: FilterOption[];
    locations?: FilterOption[];
    conditions?: FilterOption[];
    price_range?: PriceRange;
    attributes?: Record<string, FilterOption[]>;
  };
  currentFilters: Record<string, any>;
  onFilterChange: (filters: Record<string, any>) => void;
}

export function SearchFilters({ facets, currentFilters, onFilterChange }: SearchFiltersProps) {
  const { locale } = useI18n();
  const [localFilters, setLocalFilters] = useState(currentFilters);

  const label = (ru: string, uz: string) => (locale === 'uz' ? uz : ru);

  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    if (!value || value === '' || (Array.isArray(value) && value.length === 0)) {
      delete newFilters[key];
    }
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAttributeChange = (attrKey: string, value: string, checked: boolean) => {
    const currentValues = localFilters[`attrs.${attrKey}`] || [];
    let newValues: string[];

    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter((v: string) => v !== value);
    }

    handleFilterChange(`attrs.${attrKey}`, newValues.length > 0 ? newValues : undefined);
  };

  const clearFilters = () => {
    setLocalFilters({});
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(localFilters).length > 0;

  return (
    <div className="search-filters">
      <div className="filter-header">
        <h3>{label('Фильтры', 'Filterlar')}</h3>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="filter-clear">
            {label('Очистить', 'Tozalash')}
          </button>
        )}
      </div>

      {/* Price Range */}
      {facets.price_range && (
        <div className="filter-section">
          <h4>{label('Цена', 'Narxi')}</h4>
          <div className="filter-price-range">
            <input
              type="number"
              placeholder={label('От', 'Dan')}
              value={localFilters.min_price || ''}
              onChange={(e) => handleFilterChange('min_price', e.target.value)}
              className="filter-input"
            />
            <span>—</span>
            <input
              type="number"
              placeholder={label('До', 'Gacha')}
              value={localFilters.max_price || ''}
              onChange={(e) => handleFilterChange('max_price', e.target.value)}
              className="filter-input"
            />
          </div>
          {facets.price_range && (
            <div className="filter-hint">
              {label('Диапазон:', 'Oraliq:')} {Math.floor(facets.price_range.min)} — {Math.ceil(facets.price_range.max)}
            </div>
          )}
        </div>
      )}

      {/* Condition */}
      {facets.conditions && facets.conditions.length > 0 && (
        <div className="filter-section">
          <h4>{label('Состояние', 'Holati')}</h4>
          <div className="filter-options">
            {facets.conditions.map((option) => (
              <label key={option.key} className="filter-checkbox">
                <input
                  type="radio"
                  name="condition"
                  value={option.key}
                  checked={localFilters.condition === option.key}
                  onChange={(e) => handleFilterChange('condition', e.target.value)}
                />
                <span>
                  {option.key === 'new' ? label('Новое', 'Yangi') : label('Б/У', 'Ishlatilgan')} ({option.count})
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Locations */}
      {facets.locations && facets.locations.length > 0 && (
        <div className="filter-section">
          <h4>{label('Местоположение', 'Joylashuv')}</h4>
          <div className="filter-options">
            {facets.locations.slice(0, 10).map((option) => (
              <label key={option.key} className="filter-checkbox">
                <input
                  type="radio"
                  name="location"
                  value={option.key}
                  checked={localFilters.location_slug === option.key}
                  onChange={(e) => handleFilterChange('location_slug', e.target.value)}
                />
                <span>{option.key} ({option.count})</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Attributes */}
      {facets.attributes && Object.entries(facets.attributes).map(([attrKey, options]) => (
        <div key={attrKey} className="filter-section">
          <h4>{attrKey.replace(/_/g, ' ')}</h4>
          <div className="filter-options">
            {options.slice(0, 10).map((option) => (
              <label key={option.key} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={localFilters[`attrs.${attrKey}`]?.includes(option.key) || false}
                  onChange={(e) => handleAttributeChange(attrKey, option.key, e.target.checked)}
                />
                <span>{option.key} ({option.count})</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

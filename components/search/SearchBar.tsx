import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import CategoryPicker from '@/components/ui/CategoryPicker';
import type { CategoryNode } from '@/app/search/types';

interface SearchBarProps {
  q: string;
  setQ: (q: string) => void;
  selectedCategory: { id: number; slug: string } | null;
  selectedCategoryPath: string;
  categoryTree: CategoryNode[];
  onSearch: () => void;
  onCategorySelect: (payload: { id: number; path: string }) => void;
  loading?: boolean;
}

export default function SearchBar({
  q,
  setQ,
  selectedCategory,
  selectedCategoryPath,
  categoryTree,
  onSearch,
  onCategorySelect,
  loading = false,
}: SearchBarProps) {
  const { t } = useI18n();
  const [catPickerOpen, setCatPickerOpen] = useState(false);

  return (
    <div className="olx-search-bar">
      <div className="search-input-wrapper">
        <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          className="olx-search-input"
          placeholder={t('searchPage.searchPlaceholder')}
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSearch()}
        />
      </div>

      <button
        type="button"
        className="category-select-btn"
        onClick={() => setCatPickerOpen(true)}
      >
        <span className="truncate">
          {selectedCategory ? selectedCategoryPath : t('searchPage.allCategories')}
        </span>
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <button className="olx-search-btn" onClick={onSearch} disabled={loading}>
        {loading ? (
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          t('searchPage.searchButton')
        )}
      </button>

      <CategoryPicker
        open={catPickerOpen}
        categories={categoryTree}
        onClose={() => setCatPickerOpen(false)}
        onSelect={(payload) => {
          onCategorySelect(payload);
          setCatPickerOpen(false);
        }}
      />
    </div>
  );
}

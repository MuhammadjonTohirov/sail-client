import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import CategoryPicker from '@/components/ui/CategoryPicker';
import type { CategoryNode } from '@/app/search/types';
import { Lineicons } from "@lineiconshq/react-lineicons";
import {
  Spinner2SacleOutlined,
  Search1Outlined as Search,
  ChevronDownOutlined as ChevronDown,
} from "@lineiconshq/free-icons";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="olx-search-bar">
      <div className="search-input-wrapper">
        <div className="search-icon">
          <Lineicons icon={Search} width={24} height={24} />
        </div>
        <input
          className="olx-search-input"
          placeholder={t('searchPage.searchPlaceholder')}
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSearch()}
          suppressHydrationWarning
        />
      </div>

      <button
        type="button"
        className="category-select-btn"
        onClick={() => setCatPickerOpen(true)}
      >
        <span className="truncate" suppressHydrationWarning>
          {selectedCategory ? selectedCategoryPath : t('searchPage.allCategories')}
        </span>
        <div className="flex-shrink-0">
          <Lineicons icon={ChevronDown} width={16} height={16} />
        </div>
      </button>

      <button
        className={`app-search-btn ${loading ? 'loading' : ''}`}
        onClick={onSearch}
        disabled={loading}
        suppressHydrationWarning
      >
        <div className="relative flex items-center justify-center">
          <span className={loading ? 'opacity-50' : ''}>
            {t('searchPage.searchButton')}
          </span>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Lineicons
                icon={Spinner2SacleOutlined}
                width={12}
                height={12}
              />
            </div>
          )}
        </div>
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

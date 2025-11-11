import { useI18n } from '@/lib/i18n';

interface SearchResultsBarProps {
  viewMode: 'list' | 'grid';
  setViewMode: (mode: 'list' | 'grid') => void;
}

export default function SearchResultsBar({
  viewMode,
  setViewMode,
}: SearchResultsBarProps) {
  const { t } = useI18n();

  return (
    <div className="results-bar card">
      <div className="view-toggle-wrapper">
        <button
          type="button"
          className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => setViewMode('list')}
          aria-label={t('searchPage.listView')}
        >
          <svg className="view-icon" fill="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="5" width="18" height="4" rx="1" />
            <rect x="3" y="11" width="18" height="4" rx="1" />
            <rect x="3" y="17" width="18" height="4" rx="1" />
          </svg>
        </button>
        <button
          type="button"
          className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
          onClick={() => setViewMode('grid')}
          aria-label={t('searchPage.gridView')}
        >
          <svg className="view-icon" fill="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="8" height="8" rx="1" />
            <rect x="13" y="3" width="8" height="8" rx="1" />
            <rect x="3" y="13" width="8" height="8" rx="1" />
            <rect x="13" y="13" width="8" height="8" rx="1" />
          </svg>
        </button>
      </div>
    </div>
  );
}

import { useI18n } from '@/lib/i18n';
import { Lineicons } from "@lineiconshq/react-lineicons";
import {
  MenuHamburger1Outlined as ListIcon,
  Layout26Outlined as GridIcon,
} from "@lineiconshq/free-icons";

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
          suppressHydrationWarning
        >
          <Lineicons icon={ListIcon} width={20} height={20} />
        </button>
        <button
          type="button"
          className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
          onClick={() => setViewMode('grid')}
          aria-label={t('searchPage.gridView')}
          suppressHydrationWarning
        >
          <Lineicons icon={GridIcon} width={20} height={20} />
        </button>
      </div>
    </div>
  );
}

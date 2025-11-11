import { useI18n } from '@/lib/i18n';

interface SearchBreadcrumbsProps {
  selectedCategoryPath: string;
  basePath: string;
  onSaveSearch: () => void;
}

export default function SearchBreadcrumbs({
  selectedCategoryPath,
  basePath,
  onSaveSearch,
}: SearchBreadcrumbsProps) {
  const { t } = useI18n();

  return (
    <div className="breadcrumbs mb-4">
      <a href={`${basePath}/search`} className="breadcrumb-link">
        {t('searchPage.homeBreadcrumb')}
      </a>
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      <span className="text-gray-700">{selectedCategoryPath}</span>
      <div style={{ flexGrow: 1 }}></div>
      <button
        type="button"
        className="olx-save-filter-btn"
        title={t('searchPage.saveSearch')}
        onClick={onSaveSearch}
      >
        <span className="ml-1">{t('searchPage.saveSearch')}</span>
      </button>
    </div>
  );
}

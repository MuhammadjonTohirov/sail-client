import { useI18n } from '@/lib/i18n';
import { Lineicons } from "@lineiconshq/react-lineicons";
import {
  ArrowRightOutlined as ChevronRight,
  HeartOutlined as Heart,
} from "@lineiconshq/free-icons";

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
      <div className="w-4 h-4 text-gray-400 flex items-center justify-center">
        <Lineicons icon={ChevronRight} width={16} height={16} />
      </div>
      <span className="text-gray-700">{selectedCategoryPath}</span>
      <div style={{ flexGrow: 1 }}></div>
      <button
        type="button"
        className="olx-save-filter-btn flex items-center"
        title={t('searchPage.saveSearch')}
        onClick={onSaveSearch}
      >
        <Lineicons icon={Heart} width={16} height={16} />
        <span className="ml-1">{t('searchPage.saveSearch')}</span>
      </button>
    </div>
  );
}

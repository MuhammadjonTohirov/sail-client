interface ListingInfoViewProps {
  listingId: number;
  title: string;
  categoryName?: string;
  description?: string;
  chips: Array<{ label: string }>;
  reportMsg: string;
  reportModalOpen: boolean;
  onReportClick: () => void;
  t: (key: string) => string;
}

export const ListingInfoView = ({
  listingId,
  title,
  categoryName,
  description,
  chips,
  reportMsg,
  reportModalOpen,
  onReportClick,
  t,
}: ListingInfoViewProps) => {
  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div className="breadcrumbs mb-4">
        <a href={`/`} className="breadcrumb-link">
          {t('listing.home')}
        </a>
        <span className="breadcrumb-sep">›</span>
        <a href={`/search`} className="breadcrumb-link">
          {categoryName || t('listing.allCategories')}
        </a>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{title}</span>
      </div>

      <h1 className="detail-title">{title}</h1>

      {chips.length > 0 && (
        <div className="detail-attributes">
          <h3 className="attributes-title">{t('listing.characteristics')}</h3>
          <div className="attributes-grid">
            {chips.map((c, i) => (
              <div key={i} className="attribute-row">
                {c.label}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="detail-section">
        <h3 className="section-title">{t('listing.description')}</h3>
        <p className="description-text">
          {description || <span className="text-gray-400">{t('listing.noDescription')}</span>}
        </p>
      </div>

      <div className="border-t mt-6 pt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-gray-400">ID: {listingId}</span>
          <div className="flex items-center gap-3">
            {reportMsg && <span className="text-xs text-green-600">{reportMsg}</span>}
            <button
              className="text-sm hover:text-red-500 transition-colors flex items-center gap-2"
              onClick={onReportClick}
              disabled={reportModalOpen}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              {t('listing.report')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

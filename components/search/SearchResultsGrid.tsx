import { useI18n } from '@/lib/i18n';
import ProductCard, { searchListinToProductHit } from './ProductCard';
import { SearchListing } from '@/domain/models/SearchListing';

interface SearchResultsGridProps {
  results: SearchListing[];
  loading: boolean;
  viewMode: 'list' | 'grid';
  basePath: string;
  locale: 'ru' | 'uz';
}

export default function SearchResultsGrid({
  results,
  loading,
  viewMode,
  basePath,
  locale,
}: SearchResultsGridProps) {
  const { t } = useI18n();

  if (results.length === 0 && !loading) {
    return (
      <div className="card" style={{ padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 48, opacity: 0.2, marginBottom: 8 }}>🔎</div>
        <h3 style={{ margin: 0 }}>{t('searchPage.noResultsTitle')}</h3>
        <p className="muted">{t('searchPage.noResultsDescription')}</p>
      </div>
    );
  }

  return (
    <div className={`grid ${viewMode === 'list' ? 'list-view' : ''}`}>
      {results.map((r) => (
        <ProductCard
          key={r.id}
          hit={searchListinToProductHit(r)}
          href={`${basePath}/l/${r.id}`}
          locale={locale}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
}

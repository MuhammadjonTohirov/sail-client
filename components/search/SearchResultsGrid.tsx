import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import ProductCard, { searchListinToProductHit, ProductHit } from './ProductCard';
import { SearchListing } from '@/domain/models/SearchListing';
import { SuggestedListingsRepositoryImpl } from '@/data/repositories/SuggestedListingsRepositoryImpl';
import { GetSuggestedListingsUseCase } from '@/domain/usecases/suggestedListings/GetSuggestedListingsUseCase';
import { Listing } from '@/domain/models/Listing';

interface SearchResultsGridProps {
  results: SearchListing[];
  loading: boolean;
  viewMode: 'list' | 'grid';
  basePath: string;
  locale: 'ru' | 'uz';
}

function convertListingToHit(listing: Listing): ProductHit {
  const mediaUrls = listing.media && listing.media.length > 0
    ? listing.media.map(m => m.imageUrl).filter(Boolean) as string[]
    : [];

  return {
    id: listing.id.toString(),
    title: listing.title,
    price: listing.priceAmount ? Number(listing.priceAmount) : 0,
    currency: listing.priceCurrency ?? "",
    media_urls: mediaUrls,
    location_name_ru: listing.locationName ?? "",
    location_name_uz: listing.locationName ?? "",
    refreshed_at: listing.refreshedAt ?? "",
    is_promoted: false,
  };
}

function SuggestedProductsSection({ basePath, locale, viewMode }: { basePath: string; locale: 'ru' | 'uz'; viewMode: 'list' | 'grid' }) {
  const { t } = useI18n();
  const [suggestions, setSuggestions] = useState<ProductHit[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setSuggestionsLoading(true);
      try {
        const repo = new SuggestedListingsRepositoryImpl();
        const fetchUseCase = new GetSuggestedListingsUseCase(repo);
        const result = await fetchUseCase.execute(8);
        setSuggestions(result.map(convertListingToHit));
      } catch (e) {
        console.error("Failed to load suggested listings", e);
      } finally {
        setSuggestionsLoading(false);
      }
    })();
  }, []);

  if (!suggestionsLoading && suggestions.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: 24 }}>
      <h3 style={{ marginBottom: 16 }} suppressHydrationWarning>
        {t('home.suggestedForYou')}
      </h3>
      {suggestionsLoading ? (
        <div className={`grid ${viewMode === 'list' ? 'list-view' : ''}`}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="olx-product-card" style={{ opacity: 0.5 }}>
              <div className="product-card-image" style={{ background: '#f0f0f0' }} />
              <div className="product-card-content">
                <div style={{ height: 20, background: '#f0f0f0', borderRadius: 4, marginBottom: 8 }} />
                <div style={{ height: 16, background: '#f0f0f0', borderRadius: 4, width: '60%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`grid ${viewMode === 'list' ? 'list-view' : ''}`}>
          {suggestions.map((hit) => (
            <ProductCard
              key={hit.id}
              hit={hit}
              href={`${basePath}/l/${hit.id}`}
              locale={locale}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
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
      <>
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 48, opacity: 0.2, marginBottom: 8 }}>🔎</div>
          <h3 style={{ margin: 0 }} suppressHydrationWarning>
            {t('searchPage.noResultsTitle')}
          </h3>
          <p className="muted" suppressHydrationWarning>
            {t('searchPage.noResultsDescription')}
          </p>
        </div>
        <SuggestedProductsSection basePath={basePath} locale={locale} viewMode={viewMode} />
      </>
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

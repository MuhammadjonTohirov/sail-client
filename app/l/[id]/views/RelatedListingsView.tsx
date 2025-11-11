import { SearchListing } from '@/domain/models/SearchListing';

interface RelatedListingsViewProps {
  listings: SearchListing[];
  loading: boolean;
  sellerId: number | null;
  t: (key: string) => string;
}

export const RelatedListingsView = ({
  listings,
  loading,
  sellerId,
  t,
}: RelatedListingsViewProps) => {
  if (listings.length === 0) {
    return null;
  }

  return (
    <div className="related-listings-section">
      <div className="section-header">
        <h2 className="section-heading">
          {t('listing.sellerOtherListings')}
        </h2>
        <a
          href={sellerId?.toString ? `/u/${sellerId}` : '#'}
          className="view-all-link"
          onClick={(e) => {
            if (!sellerId) e.preventDefault();
          }}
        >
          {t('listing.viewAll')} →
        </a>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
              <div className="w-full h-48 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="related-listings-grid">
          {listings.map((otherListing) => {
            const thumb =
              otherListing.mediaUrls?.[0] ||
              otherListing.mediaUrls?.[0] ||
              otherListing.mediaUrls?.[0] ||
              '';
            return (
              <a
                key={otherListing.id}
                href={`/l/${otherListing.id}`}
                className="related-listing-card"
              >
                <div className="related-listing-image">
                  {thumb ? (
                    <img src={thumb} alt={otherListing.title} />
                  ) : (
                    <div className="no-image">
                      <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="related-listing-content">
                  <h3 className="related-listing-title">{otherListing.title}</h3>
                  <div className="related-listing-price">
                    {(otherListing.price ?? 0) > 0 ? (
                      `${Number(otherListing.price).toLocaleString()} ${otherListing.currency}`
                    ) : (
                      t('listing.free')
                    )}
                  </div>
                  {otherListing.locationNameRu && (
                    <div className="related-listing-location">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {otherListing.locationNameRu}
                    </div>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

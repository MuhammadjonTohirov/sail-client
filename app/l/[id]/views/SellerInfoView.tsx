import Avatar from '@/components/ui/Avatar';
import { LocationMap } from '@/components/ui/LocationMap';

interface SellerInfoViewProps {
  sellerId: number | null;
  sellerDisplayName: string;
  sellerAvatarUrl?: string;
  sellerLogo?: string;
  sellerSince?: string;
  sellerLastActiveAt?: string;
  locationName?: string;
  lat?: number;
  lon?: number;
  isApproximate?: boolean; // Indicates if coordinates are geocoded/approximate
  locale: string;
  onViewAllListings: () => void;
  t: (key: string) => string;
}

export const SellerInfoView = ({
  sellerId,
  sellerDisplayName,
  sellerAvatarUrl,
  sellerLogo,
  sellerSince,
  sellerLastActiveAt,
  locationName,
  lat,
  lon,
  isApproximate = false,
  locale,
  onViewAllListings,
  t,
}: SellerInfoViewProps) => {
  const sellerSinceDate = sellerSince ? new Date(sellerSince) : null;
  const sellerLastActiveDate = sellerLastActiveAt ? new Date(sellerLastActiveAt) : null;
  const hasLocation = lat !== undefined && lon !== undefined && lat !== null && lon !== null;

  return (
    <>
      {/* Seller Card */}
      <div className="sidebar-card seller-card">
        <div className="seller-label">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {t('listing.seller')}
        </div>
        <div className="seller-info">
          <Avatar
            className="seller-avatar"
            imageUrl={sellerAvatarUrl || sellerLogo}
            placeholder={sellerDisplayName}
            alt={sellerDisplayName}
          />
          <div className="seller-details">
            <div className="seller-name">
              {sellerDisplayName || t('listing.user')}
            </div>
            <div className="seller-meta">
              {t('listing.onSiteAt')}{' '}
              {(sellerLastActiveDate ?? sellerSinceDate)?.toLocaleDateString(locale === 'uz' ? 'uz-UZ' : 'ru-RU', {
                day: 'numeric',
                year: 'numeric',
                month: 'short'
              }) || '—'}
            </div>
          </div>
        </div>
        <button
          onClick={onViewAllListings}
          className="w-full btn-outline btn-lg text-sm"
          disabled={!sellerId}
        >
          {t('listing.sellerAllListings')}
        </button>
      </div>

      {/* Location Card */}
      <div className="sidebar-card location-card">
        <div className="seller-label">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {t('listing.location')}
        </div>
        <div className="location-name">
          {locationName || t('listing.notSpecified')}
        </div>

        {/* Map if lat/lon available */}
        {hasLocation && (
          <div style={{ marginTop: '12px' }}>
            <LocationMap
              lat={lat!}
              lon={lon!}
              locationName={locationName}
              isApproximate={isApproximate}
            />
          </div>
        )}
      </div>
    </>
  );
};

import { FavoriteButton } from '@/components/FavoriteButton';

interface PriceContactViewProps {
  listingId: number;
  priceAmount: number;
  priceCurrency: string;
  isPriceNegotiable: boolean;
  createdAt?: string;
  contactPhoneMasked?: string;
  userPhone?: string;
  showPhone: boolean;
  isOwnListing: boolean;
  chatLoading: boolean;
  locale: string;
  onChatClick: () => void;
  onShowPhoneClick: () => void;
  t: (key: string) => string;
}

export const PriceContactView = ({
  listingId,
  priceAmount,
  priceCurrency,
  isPriceNegotiable,
  createdAt,
  contactPhoneMasked,
  userPhone,
  showPhone,
  isOwnListing,
  chatLoading,
  locale,
  onChatClick,
  onShowPhoneClick,
  t,
}: PriceContactViewProps) => {
  const createdAtDate = createdAt ? new Date(createdAt) : null;

  return (
    <div className="sidebar-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {createdAtDate ? createdAtDate.toLocaleDateString(locale === 'uz' ? 'uz-UZ' : 'ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : ''}
        </div>
        <FavoriteButton listingId={listingId} size="md" variant="icon" />
      </div>

      {priceAmount > 0 ? (
        <div className="price-block mb-4">
          <div className="text-4xl font-bold text-[#002F34] mb-1">
            {Number(priceAmount).toLocaleString()} <span className="text-2xl">{priceCurrency}</span>
          </div>
          {isPriceNegotiable && (
            <div className="flex items-center gap-1 text-sm text-[#23E5DB]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              {t('listing.priceNegotiable')}
            </div>
          )}
        </div>
      ) : (
        <div className="price-block mb-4">
          <div className="text-3xl font-bold text-green-600">
            {t('listing.free')}
          </div>
        </div>
      )}

      <div className="btn-row space-y-3">
        <button
          onClick={onChatClick}
          disabled={isOwnListing || chatLoading}
          className={`w-full bg-[#23E5DB] hover:bg-[#1dd4cb] text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${isOwnListing || chatLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {chatLoading ? (
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
          {t('listing.sendMessage')}
        </button>
        {isOwnListing && (
          <p className="text-xs text-gray-500 text-center">
            {t('listing.ownListing')}
          </p>
        )}

        <button
          className="w-full bg-white border-2 border-gray-300 hover:border-[#23E5DB] text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          onClick={onShowPhoneClick}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          {showPhone ? (
            contactPhoneMasked || userPhone || '—'
          ) : (
            t('listing.showPhone')
          )}
        </button>
      </div>
    </div>
  );
};

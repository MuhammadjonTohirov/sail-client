"use client";
import { useI18n } from '@/lib/i18n';
import { useRouter } from 'next/navigation';
import { RecentlyViewedTracker } from '@/components/RecentlyViewedTracker';
import { ReportModal } from '@/components/listing/ReportModal';
import ChatOverlay from '@/components/chat/ChatOverlay';
import '@/utils/string.extensions';
import { useListingDetailViewModel } from './useListingDetailViewModel';
import { GalleryView } from './views/GalleryView';
import { ListingInfoView } from './views/ListingInfoView';
import { PriceContactView } from './views/PriceContactView';
import { SellerInfoView } from './views/SellerInfoView';
import { RelatedListingsView } from './views/RelatedListingsView';

export default function ListingDetail({ params }: { params: { id: string } }) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const id = Number(params.id);

  const vm = useListingDetailViewModel({ id }, t);

  const handleChatClick = async () => {
    if (typeof window === 'undefined') return;
    if (vm.isOwnListing) return;
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/auth/otp');
      return;
    }
    await vm.openChat();
  };

  // Loading state
  if (vm.loading) {
    return (
      <div className="detail-grid">
        <div className="space-y-3">
          <div className="card" style={{ height: 520 }}>
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-[#23E5DB]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">{t('listing.loading')}</p>
              </div>
            </div>
          </div>
        </div>
        <aside>
          <div className="card" style={{ height: 200 }}></div>
        </aside>
      </div>
    );
  }

  // Error state
  if (vm.error || !vm.listing) {
    return (
      <div className="container py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {t('listing.notFound')}
            </h2>
            <p className="text-gray-600 mb-4">{vm.error || t('listing.notFoundDescription')}</p>
          </div>
          <button
            onClick={() => router.push('/search')}
            className="btn-accent"
          >
            {t('listing.backToSearch')}
          </button>
        </div>
      </div>
    );
  }

  const listing = vm.listing;
  const current = vm.mediaItems[vm.currentImageIndex]?.url ?? '';

  const chatListingSummary = {
    id,
    title: listing.title,
    priceAmount: listing.priceAmount,
    priceCurrency: listing.priceCurrency,
    thumbnailUrl: vm.primaryImage,
    sellerName: listing.seller?.name || listing.user?.displayName || listing.user?.phoneE164,
  };

  return (
    <div className="container py-6">
      <RecentlyViewedTracker listingId={id} />

      <div className="detail-grid">
        <div>
          <GalleryView
            isPromoted={listing.isPromoted || false}
            currentImage={current}
            currentImageIndex={vm.currentImageIndex}
            galleryLength={vm.galleryLength}
            mediaItems={vm.mediaItems}
            listingTitle={listing.title}
            onPrevious={vm.goToPreviousImage}
            onNext={vm.goToNextImage}
            onSelectImage={vm.setCurrentImageIndex}
            t={t}
          />

          <ListingInfoView
            listingId={listing.id}
            title={listing.title}
            categoryName={listing.categoryName}
            description={listing.description}
            chips={vm.chips}
            reportMsg={vm.reportMsg}
            reportModalOpen={vm.reportModalOpen}
            onReportClick={() => vm.setReportModalOpen(true)}
            t={t}
          />
        </div>

        <aside className="space-y-3">
          <PriceContactView
            listingId={id}
            priceAmount={listing.priceAmount}
            priceCurrency={listing.priceCurrency}
            isPriceNegotiable={listing.isPriceNegotiable || false}
            createdAt={listing.createdAt ?? undefined}
            contactPhoneMasked={listing.contactPhoneMasked ?? undefined}
            userPhone={listing.user?.phoneE164 || listing.user?.phone}
            showPhone={vm.showPhone}
            isOwnListing={vm.isOwnListing}
            chatLoading={vm.chatLoading}
            locale={locale}
            onChatClick={handleChatClick}
            onShowPhoneClick={() => vm.setShowPhone(true)}
            t={t}
          />

          <SellerInfoView
            sellerId={vm.sellerId}
            sellerDisplayName={vm.sellerDisplayName}
            sellerAvatarUrl={listing.seller?.avatarUrl?.getIfEmpty(listing.seller?.logo) ?? ''}
            sellerLogo={listing.seller?.logo ?? undefined}
            sellerSince={listing.seller?.since ?? undefined}
            sellerLastActiveAt={listing.seller?.lastActiveAt ?? undefined}
            locationName={listing.locationName ?? undefined}
            lat={listing.lat ?? vm.geocodedLocation?.lat}
            lon={listing.lon ?? vm.geocodedLocation?.lon}
            isApproximate={vm.hasGeocodedLocation}
            locale={locale}
            onViewAllListings={() => vm.sellerId && router.push(`/u/${vm.sellerId}`)}
            t={t}
          />
        </aside>
      </div>

      <RelatedListingsView
        listings={vm.sellerListings}
        loading={vm.loadingSellerListings}
        sellerId={vm.sellerId}
        t={t}
      />

      <ReportModal
        listingId={id}
        open={vm.reportModalOpen}
        locale={locale}
        onClose={() => vm.setReportModalOpen(false)}
        onSubmitted={(message) => vm.setReportMsg(message)}
      />

      {vm.chatOpen && (
        <ChatOverlay
          listing={chatListingSummary}
          thread={vm.chatThread}
          viewerId={vm.viewerId}
          loading={vm.chatLoading}
          error={vm.chatError}
          onRetry={handleChatClick}
          onClose={vm.closeChat}
          onThreadChange={vm.updateChatThread}
        />
      )}
    </div>
  );
}

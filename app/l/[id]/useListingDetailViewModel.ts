"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ListingDetailInteractor } from './ListingDetailInteractor';
import { Listing } from '@/domain/models/Listing';
import { ChatThread } from '@/domain/models/chat/ChatThread';
import { GeoLocation } from '@/domain/models/GeoLocation';
import { SearchListing } from '@/domain/models/SearchListing';

export interface UseListingDetailViewModelParams {
  id: number;
}

export interface ListingDetailViewModel {
  // Listing state
  listing: Listing | null;
  loading: boolean;
  error: string;

  // Gallery state
  currentImageIndex: number;
  showPhone: boolean;
  setCurrentImageIndex: (index: number) => void;
  setShowPhone: (show: boolean) => void;
  goToPreviousImage: () => void;
  goToNextImage: () => void;

  // Seller listings state
  sellerListings: SearchListing[];
  loadingSellerListings: boolean;

  // Chat state
  chatOpen: boolean;
  chatLoading: boolean;
  chatThread: ChatThread | null;
  chatError: string | null;
  viewerId: number | null;

  // Chat actions
  openChat: () => Promise<void>;
  closeChat: () => void;
  updateChatThread: (thread: ChatThread) => void;

  // Report modal state
  reportModalOpen: boolean;
  reportMsg: string;
  setReportModalOpen: (open: boolean) => void;
  setReportMsg: (msg: string) => void;

  // Geocoding state
  geocodedLocation: GeoLocation | null;
  hasGeocodedLocation: boolean;

  // Computed properties
  isOwnListing: boolean;
  sellerId: number | null;
  sellerDisplayName: string;
  primaryImage: string;
  mediaItems: Array<{ id: number; url: string }>;
  galleryLength: number;
  chips: Array<{ label: string }>;
}

export const useListingDetailViewModel = (
  params: UseListingDetailViewModelParams,
  t: (key: string) => string
): ListingDetailViewModel => {
  const { id } = params;
  const interactorRef = useRef(new ListingDetailInteractor());

  // Listing state
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Gallery state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPhone, setShowPhone] = useState(false);

  // Seller listings state
  const [sellerListings, setSellerListings] = useState<SearchListing[]>([]);
  const [loadingSellerListings, setLoadingSellerListings] = useState(false);

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatThread, setChatThread] = useState<ChatThread | null>(null);
  const [chatError, setChatError] = useState<string | null>(null);
  const [viewerId, setViewerId] = useState<number | null>(null);

  // Report modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportMsg, setReportMsg] = useState('');

  // Geocoding state
  const [geocodedLocation, setGeocodedLocation] = useState<GeoLocation | null>(null);

  // Load viewer ID from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const readProfile = () => {
      try {
        const raw = localStorage.getItem('profile');
        if (!raw) {
          setViewerId(null);
          return;
        }
        const parsed = JSON.parse(raw);
        const uid = parsed?.user_id ?? parsed?.id ?? null;
        setViewerId(typeof uid === 'number' ? uid : null);
      } catch {
        setViewerId(null);
      }
    };
    readProfile();
    window.addEventListener('auth-changed', readProfile);
    return () => window.removeEventListener('auth-changed', readProfile);
  }, []);

  // Fetch listing detail
  useEffect(() => {
    if (!Number.isFinite(id) || id <= 0) {
      setListing(null);
      setError(t('listing.notFound'));
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const result = await interactorRef.current.fetchListingDetail(id);
        if (!cancelled) {
          setListing(result);
        }
      } catch (e: any) {
        if (!cancelled) {
          setListing(null);
          const errorMsg = e?.message || t('listing.notFound');
          setError(errorMsg);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, t]);

  // Reset chat state when ID changes
  useEffect(() => {
    setChatOpen(false);
    setChatThread(null);
    setChatError(null);
  }, [id]);

  // Fetch seller's other listings
  useEffect(() => {
    const sellerId = listing?.seller?.id ?? listing?.userId;
    if (!sellerId) return;
    let cancelled = false;
    (async () => {
      setLoadingSellerListings(true);
      try {
        const results = await interactorRef.current.fetchSellerListings(sellerId, id);
        if (!cancelled) {
          setSellerListings(results);
        }
      } catch (e) {
        if (!cancelled) {
          console.error('Failed to load seller listings', e);
        }
      } finally {
        if (!cancelled) {
          setLoadingSellerListings(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, listing?.seller?.id, listing?.userId]);

  // Auto-clear report message
  useEffect(() => {
    if (!reportMsg) return;
    const timer = setTimeout(() => setReportMsg(''), 4000);
    return () => clearTimeout(timer);
  }, [reportMsg]);

  // Geocode location if coordinates are missing
  useEffect(() => {
    const hasCoordinates =
      listing?.lat !== null &&
      listing?.lat !== undefined &&
      listing?.lon !== null &&
      listing?.lon !== undefined;

    if (hasCoordinates) {
      setGeocodedLocation(null);
      return;
    }

    const locationName = listing?.locationName;
    if (!locationName) {
      setGeocodedLocation(null);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const location = await interactorRef.current.geocodeLocation(locationName);
        if (!cancelled) {
          setGeocodedLocation(location);
        }
      } catch (e) {
        if (!cancelled) {
          console.error('Failed to geocode location:', e);
          setGeocodedLocation(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [listing?.lat, listing?.lon, listing?.locationName]);

  // Computed: media items
  const mediaItems = useMemo(() => {
    if (!listing) return [];
    const rawMedia = Array.isArray(listing.media) && listing.media.length > 0 ? listing.media : undefined;
    const mediaUrls = listing.mediaUrls && listing.mediaUrls.length > 0 ? listing.mediaUrls : [];
    const items = rawMedia
      ? rawMedia
          .map((item, index) => ({
            id: item.id ?? index,
            url: item.imageUrl || item.image || '',
          }))
          .filter((item) => item.url)
      : mediaUrls.map((url, index) => ({ id: index, url }));
    return items;
  }, [listing]);

  const galleryLength = mediaItems.length;
  const primaryImage = mediaItems[0]?.url ?? '';

  // Computed: seller info
  const sellerId = listing?.seller?.id ?? listing?.userId ?? listing?.user?.id ?? null;
  const sellerDisplayName =
    listing?.seller?.name ||
    listing?.user?.displayName ||
    listing?.user?.name ||
    listing?.user?.phoneE164 ||
    'U';

  // Computed: is own listing
  const isOwnListing =
    viewerId != null && viewerId === (listing?.seller?.id ?? listing?.userId ?? listing?.user?.id);

  // Computed: chips (attributes)
  const chips = useMemo(() => {
    if (!listing) return [];
    const arr: { label: string }[] = [];
    arr.push({
      label:
        listing.sellerType === 'business'
          ? t('listing.sellerTypeBusiness')
          : t('listing.sellerTypePrivate'),
    });
    arr.push({
      label:
        t('listing.conditionLabel') +
        (listing.condition === 'new' ? t('listing.conditionNew') : t('listing.conditionUsed')),
    });
    (listing.attributes || []).forEach((attr) => {
      const raw = attr?.value;
      const value = Array.isArray(raw)
        ? raw.join(', ')
        : raw !== undefined && raw !== null
        ? String(raw)
        : '';
      if (value) {
        arr.push({ label: `${attr.label ?? attr.key}: ${value}` });
      }
    });
    return arr;
  }, [listing, t]);

  // Gallery actions
  const goToPreviousImage = useCallback(() => {
    setCurrentImageIndex((i) => (i - 1 + galleryLength) % Math.max(galleryLength, 1));
  }, [galleryLength]);

  const goToNextImage = useCallback(() => {
    setCurrentImageIndex((i) => (i + 1) % Math.max(galleryLength, 1));
  }, [galleryLength]);

  // Chat actions
  const openChat = useCallback(async () => {
    if (typeof window === 'undefined') return;
    if (isOwnListing) return;

    const token = localStorage.getItem('access_token');
    if (!token) {
      // Will be handled by page component (navigation)
      return;
    }

    if (chatThread && chatThread.listing.listingId === id) {
      setChatError(null);
      setChatOpen(true);
      return;
    }

    setChatOpen(true);
    setChatLoading(true);
    setChatError(null);
    try {
      const existing = await interactorRef.current.findChatThread(id);
      setChatThread(existing);
    } catch (err) {
      setChatError(err instanceof Error ? err.message : t('listing.chatLoadError'));
    } finally {
      setChatLoading(false);
    }
  }, [isOwnListing, chatThread, id, t]);

  const closeChat = useCallback(() => {
    setChatOpen(false);
    setChatError(null);
  }, []);

  const updateChatThread = useCallback((thread: ChatThread) => {
    setChatThread(thread);
    setChatError(null);
    setChatLoading(false);
  }, []);

  // Computed: has geocoded location
  const hasGeocodedLocation = geocodedLocation !== null;

  return {
    // Listing state
    listing,
    loading,
    error,

    // Gallery state
    currentImageIndex,
    showPhone,
    setCurrentImageIndex,
    setShowPhone,
    goToPreviousImage,
    goToNextImage,

    // Seller listings state
    sellerListings,
    loadingSellerListings,

    // Chat state
    chatOpen,
    chatLoading,
    chatThread,
    chatError,
    viewerId,

    // Chat actions
    openChat,
    closeChat,
    updateChatThread,

    // Report modal state
    reportModalOpen,
    reportMsg,
    setReportModalOpen,
    setReportMsg,

    // Geocoding state
    geocodedLocation,
    hasGeocodedLocation,

    // Computed properties
    isOwnListing,
    sellerId,
    sellerDisplayName,
    primaryImage,
    mediaItems,
    galleryLength,
    chips,
  };
};

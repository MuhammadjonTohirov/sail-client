'use client';

import { useEffect } from 'react';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

interface RecentlyViewedTrackerProps {
  listingId: number;
}

/**
 * Automatically tracks that a user has viewed a listing.
 * Add this component to any listing detail page.
 */
export function RecentlyViewedTracker({ listingId }: RecentlyViewedTrackerProps) {
  const { trackViewed } = useRecentlyViewed();

  useEffect(() => {
    if (listingId) {
      trackViewed(listingId);
    }
  }, [listingId, trackViewed]);

  return null; // This component doesn't render anything
}

# Quick Integration Examples

## 1. Add Favorite & Recently Viewed to Listing Detail Page

Update your listing detail page (`app/l/[id]/page.tsx`):

```tsx
'use client';

import { useEffect, useState } from 'react';
import { Listings } from '@/lib/api';
import { FavoriteButton } from '@/components/FavoriteButton';
import { RecentlyViewedTracker } from '@/components/RecentlyViewedTracker';

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const listingId = parseInt(params.id);
  const [listing, setListing] = useState(null);

  useEffect(() => {
    Listings.detail(listingId).then(setListing);
  }, [listingId]);

  if (!listing) return <div>Loading...</div>;

  return (
    <div className="listing-detail">
      {/* Track view automatically */}
      <RecentlyViewedTracker listingId={listingId} />

      <div className="listing-header">
        <h1>{listing.title}</h1>

        {/* Add favorite button */}
        <FavoriteButton listingId={listingId} variant="button" size="lg" />
      </div>

      {/* Rest of your listing content */}
      <div className="listing-price">{listing.price_amount} {listing.price_currency}</div>
      <div className="listing-description">{listing.description}</div>
    </div>
  );
}
```

## 2. Add Favorite Button to Listing Cards

Update your listing card component:

```tsx
import Link from 'next/link';
import { FavoriteButton } from '@/components/FavoriteButton';

export function ListingCard({ listing }) {
  return (
    <div className="listing-card">
      {/* Favorite button positioned absolutely */}
      <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10 }}>
        <FavoriteButton listingId={listing.id} size="sm" />
      </div>

      <Link href={`/l/${listing.id}`}>
        <img src={listing.media_urls?.[0]} alt={listing.title} />
        <div className="listing-card-body">
          <h3>{listing.title}</h3>
          <p>{listing.price_amount} {listing.price_currency}</p>
        </div>
      </Link>
    </div>
  );
}
```

## 3. Add Filters to Search Page

Update your search page (`app/search/page.tsx`):

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from '@/lib/api';
import { SearchFilters } from '@/components/SearchFilters';
import { ListingCard } from '@/components/ListingCard';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
  });
  const [results, setResults] = useState({
    results: [],
    total: 0,
    facets: {}
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const doSearch = async () => {
      setLoading(true);
      try {
        const data = await Search.listings(filters);
        setResults(data);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };
    doSearch();
  }, [filters]);

  return (
    <div className="container">
      <div className="search-layout" style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '24px',
        marginTop: '20px'
      }}>
        {/* Filters sidebar */}
        <aside>
          <SearchFilters
            facets={results.facets}
            currentFilters={filters}
            onFilterChange={setFilters}
          />
        </aside>

        {/* Results */}
        <main>
          <div style={{ marginBottom: '20px' }}>
            <h1>Search Results</h1>
            <p style={{ color: 'var(--muted)' }}>
              Found {results.total} listings
            </p>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="listings-grid">
              {results.results.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
```

## 4. Display Recently Viewed on Homepage

Add a recently viewed section to your homepage:

```tsx
'use client';

import { useEffect } from 'react';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { ListingCard } from '@/components/ListingCard';

export function RecentlyViewedSection() {
  const { recentItems, load } = useRecentlyViewed();

  useEffect(() => {
    load();
  }, [load]);

  if (recentItems.length === 0) return null;

  return (
    <section className="recently-viewed-section">
      <h2>Recently Viewed</h2>
      <div className="listings-grid">
        {recentItems.slice(0, 4).map(item => (
          <ListingCard
            key={item.id}
            listing={{
              id: item.listing,
              title: item.listing_title,
              price_amount: item.listing_price,
              location: item.listing_location,
              media_urls: item.listing_media_urls,
            }}
          />
        ))}
      </div>
    </section>
  );
}
```

## 5. Custom Hook Usage Example

For more control, use the hooks directly:

```tsx
'use client';

import { useFavorites } from '@/hooks/useFavorites';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

export function UserActivity() {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { recentItems, trackViewed } = useRecentlyViewed();

  const handleLike = async (listingId: number) => {
    try {
      const isFavorited = await toggleFavorite(listingId);
      alert(isFavorited ? 'Added to favorites!' : 'Removed from favorites!');
    } catch (error) {
      alert('Failed to update favorites');
    }
  };

  return (
    <div>
      <h2>My Activity</h2>

      <section>
        <h3>Favorites ({favorites.length})</h3>
        {favorites.map(item => (
          <div key={item.id}>
            {item.listing_title}
            <button onClick={() => handleLike(item.listing)}>
              Unlike
            </button>
          </div>
        ))}
      </section>

      <section>
        <h3>Recently Viewed</h3>
        {recentItems.map(item => (
          <div key={item.id}>{item.listing_title}</div>
        ))}
      </section>
    </div>
  );
}
```

## Quick Start Checklist

1. ✅ Server-side: Run migrations (if needed)
   ```bash
   cd server
   python manage.py makemigrations favorites
   python manage.py migrate
   ```

2. ✅ Add FavoriteButton to listing cards
3. ✅ Add RecentlyViewedTracker to listing detail pages
4. ✅ Add SearchFilters to search page
5. ✅ Test the features!

All components are ready to use. Just import and add them to your pages!

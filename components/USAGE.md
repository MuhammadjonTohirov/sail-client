# Component Usage Guide

## Favorites System

### 1. FavoriteButton Component

Add a favorite/like button to any listing card or detail page.

```tsx
import { FavoriteButton } from '@/components/FavoriteButton';

// Icon variant (default)
<FavoriteButton listingId={123} />

// Button variant with text
<FavoriteButton listingId={123} variant="button" size="lg" />

// Small icon for cards
<FavoriteButton listingId={123} size="sm" />
```

### 2. useFavorites Hook

Use the favorites hook in any component:

```tsx
import { useFavorites } from '@/hooks/useFavorites';

function MyComponent() {
  const { favorites, loading, toggleFavorite, isFavorite } = useFavorites();

  return (
    <div>
      {favorites.map(item => (
        <div key={item.id}>{item.listing_title}</div>
      ))}
    </div>
  );
}
```

## Recently Viewed System

### 1. RecentlyViewedTracker Component

Add this to listing detail pages to automatically track views:

```tsx
import { RecentlyViewedTracker } from '@/components/RecentlyViewedTracker';

// In your listing detail page
export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const listingId = parseInt(params.id);

  return (
    <div>
      <RecentlyViewedTracker listingId={listingId} />
      {/* Rest of your page content */}
    </div>
  );
}
```

### 2. useRecentlyViewed Hook

```tsx
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

function RecentlyViewedSection() {
  const { recentItems, loading, clearAll } = useRecentlyViewed();

  useEffect(() => {
    load(); // Load items when component mounts
  }, []);

  return (
    <div>
      <h3>Recently Viewed</h3>
      {recentItems.map(item => (
        <div key={item.id}>{item.listing_title}</div>
      ))}
      <button onClick={clearAll}>Clear All</button>
    </div>
  );
}
```

## Search Filters

### SearchFilters Component

Add faceted search filters to your search page:

```tsx
import { SearchFilters } from '@/components/SearchFilters';
import { Search } from '@/lib/api';

function SearchPage() {
  const [filters, setFilters] = useState({});
  const [results, setResults] = useState({ results: [], facets: {} });

  useEffect(() => {
    async function search() {
      const data = await Search.listings({ ...filters, page: 1 });
      setResults(data);
    }
    search();
  }, [filters]);

  return (
    <div className="search-layout">
      <aside>
        <SearchFilters
          facets={results.facets || {}}
          currentFilters={filters}
          onFilterChange={setFilters}
        />
      </aside>
      <main>
        {/* Display search results */}
      </main>
    </div>
  );
}
```

## API Functions

All API functions are available from `@/lib/api`:

### Favorites API
- `Favorites.list()` - Get all favorites
- `Favorites.toggle(listingId)` - Toggle favorite status
- `Favorites.delete(listingId)` - Remove from favorites

### Recently Viewed API
- `RecentlyViewed.list()` - Get recently viewed items
- `RecentlyViewed.track(listingId)` - Track a view
- `RecentlyViewed.clear()` - Clear all history

### Search API
- `Search.listings(params)` - Search with filters
  - Params: `q`, `category_slug`, `location_slug`, `min_price`, `max_price`, `condition`, `attrs.*`, `sort`, `page`, `per_page`

## Server-Side Endpoints

All endpoints are already implemented and working:

### Favorites
- `GET /api/v1/favorites` - List favorites (auth required)
- `POST /api/v1/favorites/<listing_id>/toggle` - Toggle favorite (auth required)
- `DELETE /api/v1/favorites/<listing_id>` - Remove favorite (auth required)

### Recently Viewed
- `GET /api/v1/recently-viewed` - List recent items (uses auth or session)
- `POST /api/v1/recently-viewed/<listing_id>` - Track view (uses auth or session)
- `DELETE /api/v1/recently-viewed/clear` - Clear history (uses auth or session)

### Search
- `GET /api/v1/search/listings` - Search with facets
  - Query params: `q`, `category_slug`, `location_slug`, `min_price`, `max_price`, `condition`, `attrs.<key>`, `attrs.<key>_min`, `attrs.<key>_max`, `sort`, `page`, `per_page`
  - Returns: `{ results: [], total: number, facets: {} }`

## Examples

### Complete Listing Card with Favorite Button

```tsx
import { FavoriteButton } from '@/components/FavoriteButton';
import Link from 'next/link';

function ListingCard({ listing }) {
  return (
    <div className="listing-card">
      <Link href={`/l/${listing.id}`}>
        <img src={listing.media_urls[0]} alt={listing.title} />
        <h3>{listing.title}</h3>
        <p>{listing.price_amount} {listing.price_currency}</p>
      </Link>
      <FavoriteButton listingId={listing.id} size="sm" />
    </div>
  );
}
```

### Complete Search Page with Filters

```tsx
'use client';

import { useState, useEffect } from 'react';
import { SearchFilters } from '@/components/SearchFilters';
import { Search } from '@/lib/api';
import ListingCard from '@/components/ListingCard';

export default function SearchPage() {
  const [filters, setFilters] = useState({});
  const [results, setResults] = useState({ results: [], total: 0, facets: {} });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function doSearch() {
      setLoading(true);
      try {
        const data = await Search.listings(filters);
        setResults(data);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    }
    doSearch();
  }, [filters]);

  return (
    <div className="search-layout">
      <aside className="search-sidebar">
        <SearchFilters
          facets={results.facets}
          currentFilters={filters}
          onFilterChange={setFilters}
        />
      </aside>
      <main className="search-results">
        <h1>Found {results.total} listings</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="listings-grid">
            {results.results.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
```

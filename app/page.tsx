"use client";
import { useEffect, useState, Fragment } from 'react';
import { useI18n } from '@/lib/i18n';
import CategoriesGrid from '@/components/home/CategoriesGrid';
import ProductCard from '@/components/search/ProductCard';
import Link from 'next/link';
import { appConfig } from '@/config';
import { SearchListingsUseCase } from '@/domain/usecases/search/SearchListingsUseCase';
import { SearchRepositoryImpl } from '@/data/repositories/SearchRepositoryImpl';
import { SearchListing } from '@/domain/models/SearchListing';

type Hit = {
  id: string;
  title: string;
  price?: number;
  currency?: string;
  media_urls?: string[];
  location_name_ru?: string;
  location_name_uz?: string;
  refreshed_at?: string;
  is_promoted?: boolean;
};

// convert SearchListing to Hit
function convertToHit(listing: SearchListing): Hit {
  return {
    id: listing.id,
    title: listing.title,
    price: listing.price ?? 0,
    currency: listing.currency ?? '',
    media_urls: listing.mediaUrls ?? [],
    location_name_ru: listing.locationNameRu ?? '',
    location_name_uz: listing.locationNameUz ?? '',
    refreshed_at: listing.refreshedAt ?? '',
    is_promoted: listing.isPromoted ?? false,
  };
}

export default function HomePage() {
  const { t, locale } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredListings, setFeaturedListings] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(true);

  const { name, features, contact } = appConfig;
  const heroHighlights = [
    features.enablePromotions && {
      icon: '⚡️',
      key: 'features.promotions',
    },
    features.enableFavorites && {
      icon: '❤️',
      key: 'features.favorites',
    },
    features.enableSavedSearches && {
      icon: '🔔',
      key: 'features.savedSearches',
    },
    features.enableChat && {
      icon: '💬',
      key: 'features.chat',
    },
  ].filter(Boolean) as { icon: string; key: string }[];

  if (heroHighlights.length < 3) {
    heroHighlights.push({
      icon: '📞',
      key: 'features.support',
    });
  }
  if (heroHighlights.length < 3) {
    heroHighlights.push({
      icon: '✉️',
      key: 'features.email',
    });
  }
  if (heroHighlights.length < 3) {
    heroHighlights.push({
      icon: '📍',
      key: 'features.address',
    });
  }
  const highlights = heroHighlights.slice(0, 3);

  const heroTitle = t('home.heroTitle', { name });
  const heroSubtitle = t('home.heroSubtitle');
  const featuredTitle = features.enablePromotions
    ? t('home.featuredListings')
    : t('home.recentListings');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const repo = new SearchRepositoryImpl()
        const fetchUseCase = new SearchListingsUseCase(repo);
        fetchUseCase.execute({ perPage: 8, sort: 'newest' }).then(result => {
          setFeaturedListings((result.results || []).map(convertToHit));
        })
      } catch (e) {
        console.error('Failed to load featured listings', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    } else {
      window.location.href = `/search`;
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">{heroTitle}</h1>
            <p className="hero-subtitle">{heroSubtitle}</p>

            {/* Search Bar */}
            <div className="hero-search">
              <div className="search-input-wrapper flex-1">
                <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  className="hero-search-input"
                  placeholder={t('home.searchPlaceholder')}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button className="hero-search-btn" onClick={handleSearch}>
                {t('home.searchButton')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="py-8 bg-white">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {t('home.popularCategories')}
            </h2>
            <Link href={`/search`} className="text-[#23E5DB] hover:text-[#1dd4cb] text-sm font-medium">
              {t('home.allCategories')}
            </Link>
          </div>
          <CategoriesGrid />
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-8 bg-gray-50">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{featuredTitle}</h2>
            <Link href={`/search`} className="text-[#23E5DB] hover:text-[#1dd4cb] text-sm font-medium">
              {t('home.viewAll')}
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : featuredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredListings.map(hit => (
                <ProductCard
                  key={hit.id}
                  hit={hit}
                  href={`/l/${hit.id}`}
                  locale={locale}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {t('home.noListings')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-white">
        <div className="container">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            {t('home.howItWorks')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#23E5DB] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t('home.step1Title')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('home.step1Description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#23E5DB] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t('home.step2Title')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('home.step2Description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#23E5DB] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t('home.step3Title')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('home.step3Description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-br from-[#23E5DB] to-[#35a4c8]">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('home.ctaTitle')}
          </h2>
          <p className="text-white text-lg mb-6 opacity-90">
            {t('home.ctaSubtitle')}
          </p>
          <a
            href={`/post`}
            className="inline-flex items-center gap-2 bg-white text-[#002F34] font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('home.ctaButton')}
          </a>
        </div>
      </section>
    </div>
  );
}

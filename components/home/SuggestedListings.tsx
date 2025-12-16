"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { SuggestedListingsRepositoryImpl } from "@/data/repositories/SuggestedListingsRepositoryImpl";
import { GetSuggestedListingsUseCase } from "@/domain/usecases/suggestedListings/GetSuggestedListingsUseCase";
import ProductCard, { ProductHit } from "@/components/search/ProductCard";
import { Listing } from "@/domain/models/Listing";

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

export default function SuggestedListings() {
  const { t, locale } = useI18n();
  const [suggestedListings, setSuggestedListings] = useState<ProductHit[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setSuggestionsLoading(true);
      try {
        const repo = new SuggestedListingsRepositoryImpl();
        const fetchUseCase = new GetSuggestedListingsUseCase(repo);
        const result = await fetchUseCase.execute(8);
        setSuggestedListings(result.map(convertListingToHit));
      } catch (e) {
        console.error("Failed to load suggested listings", e);
      } finally {
        setSuggestionsLoading(false);
      }
    })();
  }, []);

  if (suggestedListings.length === 0 && !suggestionsLoading) {
    return null;
  }

  return (
    <section className="py-8 bg-white">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {t("home.suggestedForYou")}
          </h2>
          <Link
            href={`/search`}
            className="text-accent hover:text-accent-2 text-sm font-medium"
          >
            {t("home.viewAll")}
          </Link>
        </div>

        {suggestionsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse"
              >
                <div className="w-full h-48 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {suggestedListings.map((hit) => (
              <ProductCard
                key={hit.id}
                hit={hit}
                href={`/l/${hit.id}`}
                locale={locale}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

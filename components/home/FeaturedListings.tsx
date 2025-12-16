"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { appConfig } from "@/config";
import { SearchRepositoryImpl } from "@/data/repositories/SearchRepositoryImpl";
import { SearchListingsUseCase } from "@/domain/usecases/search/SearchListingsUseCase";
import ProductCard, { ProductHit, searchListinToProductHit } from "@/components/search/ProductCard";

export default function FeaturedListings() {
  const { t, locale } = useI18n();
  const [featuredListings, setFeaturedListings] = useState<ProductHit[]>([]);
  const [loading, setLoading] = useState(true);
  const { features } = appConfig;

  const featuredTitle = features.enablePromotions
    ? t("home.featuredListings")
    : t("home.recentListings");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const repo = new SearchRepositoryImpl();
        const fetchUseCase = new SearchListingsUseCase(repo);
        const result = await fetchUseCase.execute({ perPage: 8, sort: "newest" });
        setFeaturedListings((result.results || []).map(searchListinToProductHit));
      } catch (e) {
        console.error("Failed to load featured listings", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="py-8 bg-gray-50">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {featuredTitle}
          </h2>
          <Link
            href={`/search`}
            className="text-accent hover:text-accent-2 text-sm font-medium"
          >
            {t("home.viewAll")}
          </Link>
        </div>

        {loading ? (
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
        ) : featuredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredListings.map((hit) => (
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
            <p className="text-gray-500">{t("home.noListings")}</p>
          </div>
        )}
      </div>
    </section>
  );
}

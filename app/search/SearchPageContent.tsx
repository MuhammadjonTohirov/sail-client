"use client";

import SearchBar from "@/components/search/SearchBar";
import SearchBreadcrumbs from "@/components/search/SearchBreadcrumbs";
import SearchFilters from "@/components/search/SearchFilters";
import SearchResultsBar from "@/components/search/SearchResultsBar";
import SearchResultsGrid from "@/components/search/SearchResultsGrid";
import { useSearchViewModel } from "./useSearchViewModel";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useI18n } from "@/lib/i18n";
import type { SearchPrefill } from "./types";

interface SearchPageContentProps {
  initialFilters?: SearchPrefill;
}

export default function SearchPageContent({
  initialFilters,
}: SearchPageContentProps = {}) {
  const { t } = useI18n();
  const {
    locale,
    basePath,
    q,
    setQ,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    currency,
    setCurrency,
    viewMode,
    setViewMode,
    categoryTree,
    selectedCategory,
    selectedCategoryPath,
    attributes,
    attrValues,
    results,
    loading,
    loadingMore,
    hasMore,
    runSearch,
    loadMore,
    selectCategoryFromPicker,
    resetFilters,
    setAttrValue,
    saveCurrentSearch,
  } = useSearchViewModel(initialFilters);

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    isLoading: loading || loadingMore,
  });

  return (
    <div className="container" style={{ paddingTop: 16, paddingBottom: 32 }}>
      <SearchBar
        q={q}
        setQ={setQ}
        selectedCategory={selectedCategory}
        selectedCategoryPath={selectedCategoryPath}
        categoryTree={categoryTree}
        onSearch={runSearch}
        onCategorySelect={selectCategoryFromPicker}
        loading={loading}
      />

      {(selectedCategory) && (
        <SearchBreadcrumbs
          selectedCategoryPath={selectedCategoryPath}
          basePath={basePath}
          onSaveSearch={saveCurrentSearch}
        />
      )}

      <div className="search-layout">
        <SearchFilters
          selectedCategory={selectedCategory}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          currency={currency}
          setCurrency={setCurrency}
          attributes={attributes}
          attrValues={attrValues}
          setAttrValue={setAttrValue}
          onResetFilters={resetFilters}
          onApplyFilters={runSearch}
        />

        <section className="search-results">
          <SearchResultsBar viewMode={viewMode} setViewMode={setViewMode} />

          <SearchResultsGrid
            results={results}
            loading={loading}
            viewMode={viewMode}
            basePath={basePath}
            locale={locale as "ru" | "uz"}
            filterCurrency={currency || undefined}
          />

          {/* Infinite scroll sentinel */}
          {!loading && results.length > 0 && (
            <div ref={sentinelRef} className="infinite-scroll-sentinel">
              {loadingMore && (
                <div className="loading-more">
                  <div className="loading-spinner-small" />
                  <span>{t("common.loadingMore", "Loading more...")}</span>
                </div>
              )}
            </div>
          )}

          {/* End of results indicator */}
          {!loading && !hasMore && results.length > 0 && (
            <div className="end-of-results">
              <span>{t("searchPage.endOfResults", "No more listings")}</span>
            </div>
          )}
        </section>
      </div>

      <style jsx>{`
        .infinite-scroll-sentinel {
          padding: 24px 0;
          display: flex;
          justify-content: center;
          min-height: 60px;
        }

        .loading-more {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--muted);
          font-size: 14px;
        }

        .loading-spinner-small {
          width: 20px;
          height: 20px;
          border: 2px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .end-of-results {
          padding: 24px 0;
          text-align: center;
          color: var(--muted);
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}

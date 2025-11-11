"use client";
import { Suspense } from 'react';
import { useSearchViewModel } from './useSearchViewModel';
import type { SearchPrefill } from './types';
import SearchBar from '@/components/search/SearchBar';
import SearchBreadcrumbs from '@/components/search/SearchBreadcrumbs';
import SearchFilters from '@/components/search/SearchFilters';
import SearchResultsBar from '@/components/search/SearchResultsBar';
import SearchResultsGrid from '@/components/search/SearchResultsGrid';

interface SearchPageContentProps {
  initialFilters?: SearchPrefill;
}

function SearchPageContent({ initialFilters }: SearchPageContentProps = {}) {
  const {
    locale,
    basePath,
    q,
    setQ,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    viewMode,
    setViewMode,
    categoryTree,
    selectedCategory,
    selectedCategoryPath,
    attributes,
    attrValues,
    results,
    loading,
    runSearch,
    selectCategoryFromPicker,
    resetFilters,
    setAttrValue,
    saveCurrentSearch,
  } = useSearchViewModel(initialFilters);

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

      {selectedCategory && (
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
          attributes={attributes}
          attrValues={attrValues}
          setAttrValue={setAttrValue}
          onResetFilters={resetFilters}
          onApplyFilters={runSearch}
        />

        <section className="search-results">
          <SearchResultsBar
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

          <SearchResultsGrid
            results={results}
            loading={loading}
            viewMode={viewMode}
            basePath={basePath}
            locale={locale as 'ru' | 'uz'}
          />
        </section>
      </div>
    </div>
  );
}

export { SearchPageContent };

export default function SearchPage(props: SearchPageContentProps = {}) {
  return (
    <Suspense fallback={<div className="container" style={{ paddingTop: 16, paddingBottom: 32 }}>Loading...</div>}>
      <SearchPageContent initialFilters={props.initialFilters} />
    </Suspense>
  );
}

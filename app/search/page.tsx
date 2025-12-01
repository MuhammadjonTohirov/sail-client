import { Suspense } from 'react';
import type { SearchPrefill } from './types';
import SearchPageContent from './SearchPageContent';

interface SearchPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  console.log('SearchPage render with params:', searchParams);
  const initialFilters = (searchParams ?? {}) as SearchPrefill;
  return (
    <Suspense fallback={<div className="container" style={{ paddingTop: 16, paddingBottom: 32 }}>Loading...</div>}>
      <SearchPageContent initialFilters={initialFilters} />
    </Suspense>
  );
}

import { Suspense } from 'react';
import type { SearchPrefill } from './types';
import SearchPageContent from './SearchPageContent';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface SearchPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  console.log('SearchPage render with params:', searchParams);
  const initialFilters = (searchParams ?? {}) as SearchPrefill;
  return (
    <Suspense fallback={
      <div className="container" style={{ paddingTop: 16, paddingBottom: 32 }}>
        <LoadingSpinner fullScreen size="large" />
      </div>
    }>
      <SearchPageContent initialFilters={initialFilters} />
    </Suspense>
  );
}

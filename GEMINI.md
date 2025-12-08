# Project Context & Status

## Recent Updates (December 7, 2025)

### Search & Filters (Major Refactor)
- **Bug Fixes**:
  - **Double Fetching**: Eliminated redundant API calls on page load.
  - **Race Conditions**: Fixed state synchronization issues in `useSearchViewModel` by passing overrides to the run function instead of relying on `setTimeout`.
  - **Clear Filters**: Implemented robust logic to explicitly clear attribute parameters from the URL and state.
  - **Navigation**: Switched from `router.replace` to `router.push` to support browser back/forward navigation for filter changes.
  - **Type Safety**: Refactored `SearchInteractor` to properly map domain models to UI types, removing unsafe `as any` casts.

- **UI/UX Improvements**:
  - **Mobile/Tablet Layout**: 
    - Filters now display as a **horizontal wrapped list** on screens < 960px, preventing them from taking up too much vertical space.
    - Changed positioning to `static` on mobile/tablet so filters scroll naturally with the page content instead of sticking to the top.
    - Removed the mobile "Filters" modal sheet in favor of the inline horizontal view.
  - **Visuals**: Added background color to the search results area to ensure visual separation when scrolling.

## Current Implementation Status

### ✅ Completed & Stable
- **Search Engine**: 
  - Full text search with OpenSearch integration.
  - Category filtering with hierarchical tree.
  - Dynamic attribute filters (select, multiselect, range, boolean).
  - Price range filtering.
  - Sorting (relevance, price, date).
  - Saved searches functionality.
- **Frontend Architecture**:
  - Clean Architecture (Domain/Data/Presentation layers).
  - MVVM pattern for complex views (Search, Post).
  - Next.js App Router structure.

### 🚧 In Progress / Refinement
- **Mobile Responsiveness**: Search page is now optimized; other pages may need similar review.
- **Performance**: Search state management is optimized; further optimizations for large result sets (virtualization) could be considered.

## Key Files Modified
- `app/search/page.tsx`
- `app/search/useSearchViewModel.ts`
- `app/search/SearchInteractor.ts`
- `components/search/SearchFilters.tsx`
- `app/styles/layout.css`
- `app/styles/search.css`

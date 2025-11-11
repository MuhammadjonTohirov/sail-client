# Clean Architecture Migration

This document tracks the migration of the web_client codebase to Clean Architecture following SOLID principles.

## Completed Refactorings

### 1. RecentlyViewed Feature (✅ Completed)

**Status**: Migrated to Clean Architecture

**Structure Created**:

```
domain/
  models/
    RecentlyViewedListing.ts          # Domain model with clean property names
  repositories/
    IRecentlyViewedRepository.ts      # Repository interface (abstraction)
  usecases/
    recentlyViewed/
      GetRecentlyViewedUseCase.ts     # Business logic for getting recent items
      TrackRecentlyViewedUseCase.ts   # Business logic for tracking views
      ClearRecentlyViewedUseCase.ts   # Business logic for clearing history

data/
  models/
    RecentlyViewedDTO.ts              # Network response model (snake_case)
  mappers/
    RecentlyViewedMapper.ts           # Maps DTOs to domain models
  repositories/
    RecentlyViewedRepositoryImpl.ts   # Concrete implementation of repository

hooks/
  useRecentlyViewed.ts                # React hook using use cases
```

**SOLID Principles Applied**:

1. **Single Responsibility Principle (SRP)**:
   - Each use case handles one specific operation
   - Mapper only handles data transformation
   - Repository implementation only handles API calls

2. **Open/Closed Principle (OCP)**:
   - Domain models are immutable (readonly properties)
   - Use cases can be extended without modifying existing code

3. **Liskov Substitution Principle (LSP)**:
   - Repository implementation can be swapped (e.g., for testing or different data sources)
   - Any implementation of IRecentlyViewedRepository works

4. **Interface Segregation Principle (ISP)**:
   - Repository interface only defines necessary methods
   - No fat interfaces with unused methods

5. **Dependency Inversion Principle (DIP)**:
   - Use cases depend on IRecentlyViewedRepository (abstraction), not concrete implementation
   - Hook creates instances but uses abstractions

**Benefits Achieved**:

- ✅ Domain logic separated from data layer
- ✅ Clean property names in domain (camelCase) vs API (snake_case)
- ✅ Type-safe with proper interfaces
- ✅ Testable - use cases can be tested independently
- ✅ Maintainable - changes to API don't affect domain
- ✅ Consistent with DRY and SOLID principles

**Files Updated**:

- `hooks/useRecentlyViewed.ts` - Refactored to use use cases
- `app/favorites/page.tsx` - Updated to use new hook interface
- `components/RecentlyViewedTracker.tsx` - No changes needed (uses hook)

**Old API (Deprecated)**:

- `lib/recentlyViewedApi.ts` - Still exists but no longer used

---

### 2. Search Feature (✅ Completed)

**Status**: Migrated to Clean Architecture

**Structure Created**:

```
domain/
  models/
    SearchListing.ts                  # Domain model for search results
    SearchParams.ts                   # Search parameters model
    SearchResult.ts                   # Search result container
  repositories/
    ISearchRepository.ts              # Repository interface (gateway)
  usecases/
    search/
      SearchListingsUseCase.ts        # Business logic for searching

data/
  models/
    SearchDTO.ts                      # Network response models (snake_case)
  mappers/
    SearchMapper.ts                   # Maps DTOs to domain models
  repositories/
    SearchRepositoryImpl.ts           # Gateway implementation

hooks/
  useSearch.ts                        # React hook using use case
```

**Old API (Still Used)**:

- `lib/searchApi.ts` - Used internally by SearchRepositoryImpl

---

### 3. Listings Feature (✅ Completed)

**Status**: Migrated to Clean Architecture

**Structure Created**:

```
domain/
  models/
    Listing.ts                        # Domain model for listings
    ListingPayload.ts                 # Payload for create/update
    UserListingsParams.ts             # Parameters for user listings
  repositories/
    IListingsRepository.ts            # Repository interface (gateway)
  usecases/
    listings/
      CreateListingUseCase.ts         # Create listing with validation
      GetListingDetailUseCase.ts      # Get single listing
      GetMyListingsUseCase.ts         # Get current user's listings
      GetUserListingsUseCase.ts       # Get specific user's listings
      UpdateListingUseCase.ts         # Update listing
      RefreshListingUseCase.ts        # Refresh/bump listing
      UploadListingMediaUseCase.ts    # Upload media to listing
      DeleteListingMediaUseCase.ts    # Delete listing media

data/
  models/
    ListingDTO.ts                     # Network response models (snake_case)
  mappers/
    ListingMapper.ts                  # Maps DTOs to domain models
  repositories/
    ListingsRepositoryImpl.ts         # Gateway implementation

hooks/
  useListings.ts                      # React hook using all use cases
```

**Key Features**:

- 8 separate use cases, each with single responsibility
- Comprehensive validation in use cases
- Bidirectional mapping (domain ↔ DTO)
- Support for partial updates
- Media upload/delete functionality

**Old API (Still Used)**:

- `lib/listingsApi.ts` - Used internally by ListingsRepositoryImpl

---

### 4. Moderation Feature (✅ Completed)

**Status**: Migrated to Clean Architecture

**Structure Created**:

```
domain/
  models/
    ReportReason.ts                   # Domain model for report reasons
    ReportPayload.ts                  # Payload for submitting reports
  repositories/
    IModerationRepository.ts          # Repository interface (gateway)
  usecases/
    moderation/
      GetReportReasonsUseCase.ts      # Get available report reasons
      SubmitReportUseCase.ts          # Submit report with validation

data/
  models/
    ModerationDTO.ts                  # Network response models (snake_case)
  mappers/
    ModerationMapper.ts               # Maps DTOs to domain models
  repositories/
    ModerationRepositoryImpl.ts       # Gateway implementation

hooks/
  useModeration.ts                    # React hook using use cases
```

**Key Features**:

- 2 use cases for moderation operations
- Validation for report submissions
- Language support for report reasons
- Clean separation of concerns

**Old API (Still Used)**:

- `lib/moderationApi.ts` - Used internally by ModerationRepositoryImpl

---

### 5. SavedSearches Feature (✅ Completed)

**Status**: Migrated to Clean Architecture

**Structure Created**:

```
domain/
  models/
    SavedSearch.ts                    # Domain model for saved searches
    SavedSearchPayload.ts             # Payloads for create/update
  repositories/
    ISavedSearchesRepository.ts       # Repository interface (gateway)
  usecases/
    savedSearches/
      GetSavedSearchesUseCase.ts      # Get all saved searches
      CreateSavedSearchUseCase.ts     # Create with validation
      UpdateSavedSearchUseCase.ts     # Update saved search
      DeleteSavedSearchUseCase.ts     # Delete saved search

data/
  models/
    SavedSearchDTO.ts                 # Network response models (snake_case)
  mappers/
    SavedSearchMapper.ts              # Maps DTOs to domain models
  repositories/
    SavedSearchesRepositoryImpl.ts    # Gateway implementation

hooks/
  useSavedSearches.ts                 # React hook using all use cases
```

**Key Features**:

- 4 use cases for CRUD operations
- Validation for title and query
- Support for frequency settings (instant/daily)
- Active/inactive state management
- Automatic state updates after mutations

**Old API (Still Used)**:

- `lib/savedSearchesApi.ts` - Used internally by SavedSearchesRepositoryImpl

---

### 6. Taxonomy Feature (✅ Completed)

**Status**: Migrated to Clean Architecture

**Structure Created**:

```
domain/
  models/
    Category.ts                       # Domain model for categories
    Attribute.ts                      # Domain model for category attributes
    Location.ts                       # Domain model for locations
  repositories/
    ITaxonomyRepository.ts            # Repository interface (gateway)
  usecases/
    taxonomy/
      GetCategoriesUseCase.ts         # Get category tree
      GetCategoryAttributesUseCase.ts # Get attributes for category
      GetLocationsUseCase.ts          # Get locations tree

data/
  models/
    TaxonomyDTO.ts                    # Network response models (snake_case)
  mappers/
    TaxonomyMapper.ts                 # Maps DTOs to domain models
  repositories/
    TaxonomyRepositoryImpl.ts         # Gateway implementation

hooks/
  useTaxonomy.ts                      # React hook using all use cases
```

**Key Features**:

- 3 use cases for taxonomy operations
- Hierarchical data support (categories and locations)
- Language support for all endpoints
- Recursive mapping for nested structures
- Validation for category ID

**Old API (Still Used)**:

- `lib/taxonomyApi.ts` - Used internally by TaxonomyRepositoryImpl

---

### 7. Auth & Locale Utilities (✅ Completed)

**Status**: Migrated to Clean Architecture

**Structure Created**:

```
domain/
  models/
    AuthToken.ts                      # Domain model for auth tokens
    UserProfile.ts                    # Domain model for user profile
  repositories/
    IAuthRepository.ts                # Repository interface (gateway)
    ILocaleRepository.ts              # Repository interface for locale
  usecases/
    auth/
      GetAccessTokenUseCase.ts        # Get current access token
      SaveTokensUseCase.ts            # Save tokens with validation
      RefreshTokenUseCase.ts          # Refresh access token
      LogoutUseCase.ts                # Clear authentication
    locale/
      GetCurrentLocaleUseCase.ts      # Get current locale

data/
  models/
    AuthDTO.ts                        # Network response models (snake_case)
  mappers/
    AuthMapper.ts                     # Maps DTOs to domain models
  repositories/
    AuthRepositoryImpl.ts             # Gateway implementation
    LocaleRepositoryImpl.ts           # Locale repository implementation

hooks/
  useAuth.ts                          # React hook for authentication
  useLocale.ts                        # React hook for locale management
```

**Key Features**:

- 5 use cases for auth and locale operations
- Token validation in SaveTokensUseCase
- Automatic auth state management with event listeners
- Secure token storage abstraction
- Locale detection from URL path
- Support for token refresh flow

**Old API (Still Used)**:

- `lib/apiUtils.ts` - Used internally by AuthRepositoryImpl and LocaleRepositoryImpl

---

## Next Features to Migrate

### Priority Order:

1. **Favorites** - Similar pattern to RecentlyViewed
2. **Chat** - Real-time features
3. **Currency** - Currency conversion

## Migration Checklist Template

For each feature:

- [ ] Create domain models
- [ ] Create repository interface
- [ ] Create use cases (one per operation)
- [ ] Create DTOs
- [ ] Create mappers
- [ ] Create repository implementation
- [ ] Create/update custom hook
- [ ] Update components to use new hook
- [ ] Test thoroughly
- [ ] Remove old API usage
- [ ] Document changes

## Testing Strategy

For each migrated feature:

1. Unit test use cases with mocked repository
2. Unit test mappers with sample DTOs
3. Integration test repository implementation
4. E2E test in actual application

## Notes

- Keep old API files until migration is complete
- Run parallel implementations during transition
- Update one component at a time
- Ensure no breaking changes for end users

# Clean Architecture Implementation Summary

## Overview

This document provides a comprehensive summary of the Clean Architecture implementation for the web_client codebase.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  (React Components, Hooks, UI)                               │
│                                                               │
│  • hooks/useRecentlyViewed.ts                                │
│  • hooks/useSearch.ts                                        │
│  • hooks/useListings.ts                                      │
│  • app/**/*.tsx, components/**/*.tsx                         │
└───────────────────────┬─────────────────────────────────────┘
                        │ depends on
┌───────────────────────▼─────────────────────────────────────┐
│                      Domain Layer                            │
│  (Business Logic, Models, Interfaces)                        │
│                                                               │
│  • domain/models/                                            │
│  • domain/repositories/ (interfaces)                         │
│  • domain/usecases/                                          │
└───────────────────────┬─────────────────────────────────────┘
                        │ implemented by
┌───────────────────────▼─────────────────────────────────────┐
│                       Data Layer                             │
│  (Network, DTOs, Mappers, Repository Implementations)        │
│                                                               │
│  • data/models/ (DTOs)                                       │
│  • data/mappers/                                             │
│  • data/repositories/ (implementations)                      │
│  • lib/*Api.ts (existing APIs)                               │
└─────────────────────────────────────────────────────────────┘
```

## Implemented Features

### 1. Recently Viewed (✅ Complete)

**Endpoints**: `list`, `track`, `clear`

**Domain Models**:
- `RecentlyViewedListing` - Clean domain model

**Use Cases**:
- `GetRecentlyViewedUseCase`
- `TrackRecentlyViewedUseCase`
- `ClearRecentlyViewedUseCase`

**Hook**: `useRecentlyViewed()`

**Usage**:
```typescript
const { recentItems, loading, error, trackViewed, clearAll, load } = useRecentlyViewed();

// Track a view
await trackViewed(listingId);

// Load items
await load();

// Clear all
await clearAll();
```

---

### 2. Search (✅ Complete)

**Endpoints**: `listings`

**Domain Models**:
- `SearchListing` - Search result item
- `SearchParams` - Search parameters
- `SearchResult` - Search result container

**Use Cases**:
- `SearchListingsUseCase`

**Hook**: `useSearch()`

**Usage**:
```typescript
const { results, total, loading, error, search } = useSearch();

await search({
  q: 'iPhone',
  categorySlug: 'electronics',
  minPrice: 100,
  maxPrice: 1000,
  sort: 'newest',
  perPage: 20
});
```

---

### 3. Listings (✅ Complete)

**Endpoints**: `create`, `detail`, `mine`, `userListings`, `update`, `refresh`, `uploadMedia`, `deleteMedia`

**Domain Models**:
- `Listing` - Complete listing model
- `ListingPayload` - Payload for create/update
- `UserListingsParams` - Parameters for fetching user listings

**Use Cases**:
- `CreateListingUseCase` - With validation
- `GetListingDetailUseCase`
- `GetMyListingsUseCase`
- `GetUserListingsUseCase`
- `UpdateListingUseCase`
- `RefreshListingUseCase`
- `UploadListingMediaUseCase`
- `DeleteListingMediaUseCase`

**Hook**: `useListings()`

**Usage**:
```typescript
const {
  loading,
  error,
  createListing,
  getListingDetail,
  getMyListings,
  getUserListings,
  updateListing,
  refreshListing,
  uploadMedia,
  deleteMedia
} = useListings();

// Create
const newListing = await createListing({
  title: 'iPhone 13',
  description: 'Like new',
  priceAmount: 500,
  priceCurrency: 'USD',
  condition: 'used',
  categoryId: 1,
  locationId: 2
});

// Get detail
const listing = await getListingDetail(123);

// Update
await updateListing(123, { title: 'Updated Title' });

// Upload media
await uploadMedia(123, file);

// Delete media
await deleteMedia(123, 456);
```

---

## SOLID Principles Applied

### Single Responsibility Principle (SRP)
✅ Each use case handles exactly one operation
✅ Mappers only transform data
✅ Repository implementations only handle API calls

### Open/Closed Principle (OCP)
✅ Domain models are immutable (`readonly` properties)
✅ New use cases can be added without modifying existing ones
✅ Extensions through new implementations, not modifications

### Liskov Substitution Principle (LSP)
✅ Any `IRepository` implementation can replace another
✅ Perfect for testing (mock implementations)
✅ Can switch data sources without changing business logic

### Interface Segregation Principle (ISP)
✅ Repository interfaces only define necessary methods
✅ No bloated interfaces with unused methods
✅ Clean, focused contracts

### Dependency Inversion Principle (DIP)
✅ Use cases depend on `IRepository` interfaces (abstractions)
✅ Use cases don't depend on concrete implementations
✅ High-level modules don't depend on low-level modules

---

## Benefits

### 1. **Testability**
- Use cases can be unit tested with mocked repositories
- No need for real API calls in tests
- Fast, isolated tests

### 2. **Maintainability**
- Clear separation of concerns
- Changes to API don't affect business logic
- Easy to understand and modify

### 3. **Type Safety**
- Full TypeScript support
- Compile-time error checking
- Clear interfaces

### 4. **Consistency**
- Domain uses camelCase (JavaScript convention)
- DTOs use snake_case (API convention)
- Automatic mapping between conventions

### 5. **Flexibility**
- Easy to swap implementations
- Can add new data sources
- Can mock for testing or development

### 6. **Code Reusability**
- Use cases can be reused across components
- Repository logic centralized
- No duplicate code

---

## Directory Structure

```
web_client/
├── domain/                          # Business logic layer
│   ├── models/                      # Domain models (camelCase)
│   │   ├── RecentlyViewedListing.ts
│   │   ├── SearchListing.ts
│   │   ├── SearchParams.ts
│   │   ├── SearchResult.ts
│   │   ├── Listing.ts
│   │   ├── ListingPayload.ts
│   │   └── UserListingsParams.ts
│   ├── repositories/                # Repository interfaces (gateways)
│   │   ├── IRecentlyViewedRepository.ts
│   │   ├── ISearchRepository.ts
│   │   └── IListingsRepository.ts
│   └── usecases/                    # Business logic
│       ├── recentlyViewed/
│       │   ├── GetRecentlyViewedUseCase.ts
│       │   ├── TrackRecentlyViewedUseCase.ts
│       │   └── ClearRecentlyViewedUseCase.ts
│       ├── search/
│       │   └── SearchListingsUseCase.ts
│       └── listings/
│           ├── CreateListingUseCase.ts
│           ├── GetListingDetailUseCase.ts
│           ├── GetMyListingsUseCase.ts
│           ├── GetUserListingsUseCase.ts
│           ├── UpdateListingUseCase.ts
│           ├── RefreshListingUseCase.ts
│           ├── UploadListingMediaUseCase.ts
│           └── DeleteListingMediaUseCase.ts
├── data/                            # Data access layer
│   ├── models/                      # DTOs (snake_case)
│   │   ├── RecentlyViewedDTO.ts
│   │   ├── SearchDTO.ts
│   │   └── ListingDTO.ts
│   ├── mappers/                     # DTO ↔ Domain mappers
│   │   ├── RecentlyViewedMapper.ts
│   │   ├── SearchMapper.ts
│   │   └── ListingMapper.ts
│   └── repositories/                # Repository implementations
│       ├── RecentlyViewedRepositoryImpl.ts
│       ├── SearchRepositoryImpl.ts
│       └── ListingsRepositoryImpl.ts
├── hooks/                           # React hooks (presentation)
│   ├── useRecentlyViewed.ts
│   ├── useSearch.ts
│   └── useListings.ts
└── lib/                             # Existing API layer (still used)
    ├── recentlyViewedApi.ts
    ├── searchApi.ts
    └── listingsApi.ts
```

---

## Migration Strategy

### Phase 1: Create Infrastructure ✅
- Set up domain, data, and hook directories
- Define architecture patterns
- Create first implementation (RecentlyViewed)

### Phase 2: Core Features ✅
- Migrate Search (completed)
- Migrate Listings (completed)

### Phase 3: Supporting Features (Next)
- Favorites
- Chat
- Taxonomy
- Auth
- Currency
- SavedSearches

### Phase 4: Cleanup
- Remove old API direct usage
- Update all components
- Add comprehensive tests

---

## Best Practices

### 1. **Always use hooks in components**
❌ Don't: `import { Listings } from '@/lib/api'`
✅ Do: `const { getListingDetail } = useListings()`

### 2. **Keep domain models immutable**
```typescript
export interface Listing {
  readonly id: number;
  readonly title: string;
  // ... all properties readonly
}
```

### 3. **One use case per operation**
Each use case should do exactly one thing with clear responsibility.

### 4. **Validate in use cases**
Business validation belongs in use cases, not in components or repositories.

### 5. **Map at repository boundaries**
Always convert between DTOs and domain models at the repository implementation level.

### 6. **Use dependency injection**
Pass repositories to use cases via constructor for testability.

---

## Testing Examples

### Unit Test Use Case
```typescript
describe('CreateListingUseCase', () => {
  it('should create listing', async () => {
    const mockRepo: IListingsRepository = {
      createListing: jest.fn().mockResolvedValue(mockListing),
      // ... other methods
    };

    const useCase = new CreateListingUseCase(mockRepo);
    const result = await useCase.execute(payload);

    expect(mockRepo.createListing).toHaveBeenCalledWith(payload);
    expect(result).toEqual(mockListing);
  });

  it('should throw error for invalid data', async () => {
    const useCase = new CreateListingUseCase(mockRepo);

    await expect(
      useCase.execute({ ...payload, title: '' })
    ).rejects.toThrow('Title is required');
  });
});
```

### Unit Test Mapper
```typescript
describe('ListingMapper', () => {
  it('should map DTO to domain', () => {
    const dto: ListingDTO = {
      id: 1,
      title: 'Test',
      price_amount: 100,
      // ...
    };

    const domain = ListingMapper.toDomain(dto);

    expect(domain.id).toBe(1);
    expect(domain.title).toBe('Test');
    expect(domain.priceAmount).toBe(100);
  });
});
```

---

## Next Steps

1. ✅ Complete RecentlyViewed migration
2. ✅ Complete Search migration
3. ✅ Complete Listings migration
4. ⏳ Migrate Favorites
5. ⏳ Migrate remaining features
6. ⏳ Add comprehensive tests
7. ⏳ Update documentation

---

## References

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
- [Use Case Pattern](https://martinfowler.com/eaaCatalog/application.html)

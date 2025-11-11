# Moderation & SavedSearches Clean Architecture Implementation

## Overview

This document details the Clean Architecture implementation for the **Moderation** and **SavedSearches** features.

---

## 1. Moderation Feature

### Endpoints
- `GET /api/v1/reports/reasons?lang={locale}` - Get report reasons
- `POST /api/v1/reports` - Submit a report

### Domain Models

#### ReportReason
```typescript
interface ReportReason {
  readonly code: string;
  readonly label: string;
  readonly description?: string;
}
```

#### ReportPayload
```typescript
interface ReportPayload {
  readonly listingId: number;
  readonly reasonCode: string;
  readonly notes?: string;
}
```

### Repository Interface (Gateway)

```typescript
interface IModerationRepository {
  getReportReasons(language?: string): Promise<ReportReason[]>;
  submitReport(payload: ReportPayload): Promise<void>;
}
```

### Use Cases

#### GetReportReasonsUseCase
- **Purpose**: Fetch available report reasons for a given language
- **Validation**: None (language is optional)
- **Returns**: Array of ReportReason

#### SubmitReportUseCase
- **Purpose**: Submit a report for a listing
- **Validation**:
  - `listingId` must be valid (> 0)
  - `reasonCode` must be non-empty
- **Returns**: void
- **Throws**: Error if validation fails

### Hook Usage

```typescript
const { reasons, loading, error, getReportReasons, submitReport } = useModeration();

// Load report reasons
await getReportReasons('en');

// Submit a report
await submitReport({
  listingId: 123,
  reasonCode: 'SPAM',
  notes: 'This is spam content'
});
```

### Architecture Flow

```
Component
    ↓ uses
useModeration Hook
    ↓ calls
Use Cases (GetReportReasonsUseCase, SubmitReportUseCase)
    ↓ depends on
IModerationRepository (interface)
    ↑ implemented by
ModerationRepositoryImpl
    ↓ uses
Moderation API (lib/moderationApi.ts)
    ↓ calls
Backend API
```

### File Structure

```
domain/
  models/
    ReportReason.ts
    ReportPayload.ts
  repositories/
    IModerationRepository.ts
  usecases/
    moderation/
      GetReportReasonsUseCase.ts
      SubmitReportUseCase.ts

data/
  models/
    ModerationDTO.ts
  mappers/
    ModerationMapper.ts
  repositories/
    ModerationRepositoryImpl.ts

hooks/
  useModeration.ts
```

---

## 2. SavedSearches Feature

### Endpoints
- `GET /api/v1/saved-searches` - List saved searches
- `POST /api/v1/saved-searches` - Create saved search
- `PATCH /api/v1/saved-searches/{id}` - Update saved search
- `DELETE /api/v1/saved-searches/{id}` - Delete saved search

### Domain Models

#### SavedSearch
```typescript
type SearchFrequency = 'instant' | 'daily';

interface SavedSearch {
  readonly id: number;
  readonly title: string;
  readonly query: Record<string, any>;
  readonly frequency?: SearchFrequency;
  readonly isActive?: boolean;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}
```

#### SavedSearchPayload (Create)
```typescript
interface SavedSearchPayload {
  readonly title: string;
  readonly query: Record<string, any>;
  readonly frequency?: SearchFrequency;
}
```

#### SavedSearchUpdatePayload
```typescript
interface SavedSearchUpdatePayload {
  readonly title?: string;
  readonly query?: Record<string, any>;
  readonly frequency?: SearchFrequency;
  readonly isActive?: boolean;
}
```

### Repository Interface (Gateway)

```typescript
interface ISavedSearchesRepository {
  getSavedSearches(): Promise<SavedSearch[]>;
  createSavedSearch(payload: SavedSearchPayload): Promise<SavedSearch>;
  updateSavedSearch(id: number, payload: SavedSearchUpdatePayload): Promise<SavedSearch>;
  deleteSavedSearch(id: number): Promise<void>;
}
```

### Use Cases

#### GetSavedSearchesUseCase
- **Purpose**: Fetch all saved searches for the current user
- **Validation**: None
- **Returns**: Array of SavedSearch

#### CreateSavedSearchUseCase
- **Purpose**: Create a new saved search
- **Validation**:
  - `title` must be non-empty
  - `query` must be non-empty object
- **Returns**: Created SavedSearch
- **Throws**: Error if validation fails

#### UpdateSavedSearchUseCase
- **Purpose**: Update an existing saved search
- **Validation**:
  - `id` must be valid (> 0)
- **Returns**: Updated SavedSearch
- **Throws**: Error if validation fails

#### DeleteSavedSearchUseCase
- **Purpose**: Delete a saved search
- **Validation**:
  - `id` must be valid (> 0)
- **Returns**: void
- **Throws**: Error if validation fails

### Hook Usage

```typescript
const {
  savedSearches,
  loading,
  error,
  loadSavedSearches,
  createSavedSearch,
  updateSavedSearch,
  deleteSavedSearch
} = useSavedSearches();

// Load all saved searches
await loadSavedSearches();

// Create a new saved search
const newSearch = await createSavedSearch({
  title: 'iPhone in Tashkent',
  query: {
    q: 'iPhone',
    location: 'tashkent',
    category: 'electronics'
  },
  frequency: 'daily'
});

// Update a saved search
await updateSavedSearch(123, {
  title: 'Updated Title',
  isActive: false
});

// Delete a saved search
await deleteSavedSearch(123);
```

### Architecture Flow

```
Component
    ↓ uses
useSavedSearches Hook
    ↓ calls
Use Cases (Get, Create, Update, Delete)
    ↓ depends on
ISavedSearchesRepository (interface)
    ↑ implemented by
SavedSearchesRepositoryImpl
    ↓ uses
SavedSearches API (lib/savedSearchesApi.ts)
    ↓ calls
Backend API
```

### File Structure

```
domain/
  models/
    SavedSearch.ts
    SavedSearchPayload.ts
  repositories/
    ISavedSearchesRepository.ts
  usecases/
    savedSearches/
      GetSavedSearchesUseCase.ts
      CreateSavedSearchUseCase.ts
      UpdateSavedSearchUseCase.ts
      DeleteSavedSearchUseCase.ts

data/
  models/
    SavedSearchDTO.ts
  mappers/
    SavedSearchMapper.ts
  repositories/
    SavedSearchesRepositoryImpl.ts

hooks/
  useSavedSearches.ts
```

---

## SOLID Principles Applied

### Single Responsibility Principle (SRP)
✅ Each use case handles exactly one operation
✅ Mappers only transform data between layers
✅ Repository implementations only handle API communication

### Open/Closed Principle (OCP)
✅ Domain models are immutable (`readonly` properties)
✅ New use cases can be added without modifying existing ones
✅ Extensible through new implementations

### Liskov Substitution Principle (LSP)
✅ Any implementation of repository interfaces can be substituted
✅ Perfect for testing with mock implementations
✅ Can switch data sources without changing business logic

### Interface Segregation Principle (ISP)
✅ Focused interfaces with only necessary methods
✅ `IModerationRepository` - 2 methods
✅ `ISavedSearchesRepository` - 4 methods
✅ No bloated interfaces

### Dependency Inversion Principle (DIP)
✅ Use cases depend on repository interfaces (abstractions)
✅ Use cases don't depend on concrete implementations
✅ High-level modules independent of low-level details

---

## Benefits

### 1. Testability
```typescript
// Mock repository for testing
const mockRepo: ISavedSearchesRepository = {
  getSavedSearches: jest.fn().mockResolvedValue([]),
  createSavedSearch: jest.fn().mockResolvedValue(mockSearch),
  updateSavedSearch: jest.fn().mockResolvedValue(mockSearch),
  deleteSavedSearch: jest.fn().mockResolvedValue(undefined),
};

const useCase = new CreateSavedSearchUseCase(mockRepo);
```

### 2. Type Safety
- Full TypeScript support
- Compile-time error checking
- Clear interfaces and contracts

### 3. Maintainability
- Clear separation of concerns
- Changes to API don't affect business logic
- Easy to understand and modify

### 4. Consistency
- Domain models use camelCase (JavaScript convention)
- DTOs use snake_case (API convention)
- Automatic mapping between conventions

### 5. Reusability
- Use cases can be reused across components
- Repository logic centralized
- No duplicate code

---

## Data Flow Examples

### Moderation: Submit Report

```
1. Component calls: submitReport({ listingId: 123, reasonCode: 'SPAM' })
2. Hook calls: submitReportUseCase.execute(payload)
3. Use Case validates:
   - listingId > 0 ✓
   - reasonCode not empty ✓
4. Use Case calls: repository.submitReport(payload)
5. Repository maps: ReportPayload → ReportPayloadDTO
   - listingId → listing
   - reasonCode → reason_code
6. Repository calls: Moderation.submitReport(dto)
7. API sends: POST /api/v1/reports with snake_case payload
```

### SavedSearches: Create Search

```
1. Component calls: createSavedSearch({ title, query, frequency })
2. Hook calls: createUseCase.execute(payload)
3. Use Case validates:
   - title not empty ✓
   - query not empty ✓
4. Use Case calls: repository.createSavedSearch(payload)
5. Repository maps: SavedSearchPayload → SavedSearchPayloadDTO
   - (no mapping needed, same structure)
6. Repository calls: SavedSearches.create(dto)
7. API sends: POST /api/v1/saved-searches
8. API returns: SavedSearchDTO
9. Repository maps: SavedSearchDTO → SavedSearch
   - is_active → isActive
   - created_at → createdAt
10. Hook updates local state with new search
```

---

## Error Handling

### Use Case Level (Business Rules)
```typescript
// CreateSavedSearchUseCase
if (!payload.title || payload.title.trim().length === 0) {
  throw new Error('Title is required');
}
```

### Hook Level (User Feedback)
```typescript
try {
  await createSavedSearch(payload);
} catch (err) {
  const errorMessage = err instanceof Error ? err.message : 'Failed to create saved search';
  setError(errorMessage);
  throw err; // Re-throw for component handling
}
```

### Component Level (UI Display)
```typescript
const { error } = useSavedSearches();

{error && <div className="error">{error}</div>}
```

---

## State Management in Hooks

The hooks automatically manage local state for better UX:

### useSavedSearches State Updates

```typescript
// After create
setSavedSearches(prev => [...prev, result]);

// After update
setSavedSearches(prev => prev.map(item => item.id === id ? result : item));

// After delete
setSavedSearches(prev => prev.filter(item => item.id !== id));
```

This provides **optimistic updates** without requiring additional API calls to refresh the list.

---

## Migration Notes

### Old API Files
- `lib/moderationApi.ts` - Still used internally by ModerationRepositoryImpl
- `lib/savedSearchesApi.ts` - Still used internally by SavedSearchesRepositoryImpl

### Components Using Old API
To migrate components:

**Before:**
```typescript
import { Moderation } from '@/lib/api';

const reasons = await Moderation.reasons('en');
await Moderation.submitReport({ listing: 123, reason_code: 'SPAM' });
```

**After:**
```typescript
import { useModeration } from '@/hooks/useModeration';

const { getReportReasons, submitReport } = useModeration();

const reasons = await getReportReasons('en');
await submitReport({ listingId: 123, reasonCode: 'SPAM', notes: 'Details' });
```

---

## Testing Examples

### Unit Test: CreateSavedSearchUseCase

```typescript
describe('CreateSavedSearchUseCase', () => {
  let mockRepo: ISavedSearchesRepository;
  let useCase: CreateSavedSearchUseCase;

  beforeEach(() => {
    mockRepo = {
      createSavedSearch: jest.fn(),
      // ... other methods
    } as any;
    useCase = new CreateSavedSearchUseCase(mockRepo);
  });

  it('should create saved search with valid payload', async () => {
    const payload = {
      title: 'My Search',
      query: { q: 'test' }
    };
    const expected = { id: 1, ...payload };

    (mockRepo.createSavedSearch as jest.Mock).mockResolvedValue(expected);

    const result = await useCase.execute(payload);

    expect(mockRepo.createSavedSearch).toHaveBeenCalledWith(payload);
    expect(result).toEqual(expected);
  });

  it('should throw error for empty title', async () => {
    const payload = {
      title: '',
      query: { q: 'test' }
    };

    await expect(useCase.execute(payload)).rejects.toThrow('Title is required');
    expect(mockRepo.createSavedSearch).not.toHaveBeenCalled();
  });

  it('should throw error for empty query', async () => {
    const payload = {
      title: 'My Search',
      query: {}
    };

    await expect(useCase.execute(payload)).rejects.toThrow('Search query is required');
    expect(mockRepo.createSavedSearch).not.toHaveBeenCalled();
  });
});
```

### Unit Test: SavedSearchMapper

```typescript
describe('SavedSearchMapper', () => {
  it('should map DTO to domain', () => {
    const dto: SavedSearchDTO = {
      id: 1,
      title: 'Test',
      query: { q: 'test' },
      is_active: true,
      created_at: '2024-01-01'
    };

    const domain = SavedSearchMapper.toDomain(dto);

    expect(domain).toEqual({
      id: 1,
      title: 'Test',
      query: { q: 'test' },
      isActive: true,
      createdAt: '2024-01-01'
    });
  });
});
```

---

## Summary

### Moderation Feature
- ✅ 2 use cases
- ✅ Language support
- ✅ Validation for reports
- ✅ Clean domain models

### SavedSearches Feature
- ✅ 4 use cases (full CRUD)
- ✅ Validation for creation
- ✅ Partial updates support
- ✅ Automatic state management
- ✅ Frequency settings

Both features now follow Clean Architecture principles with proper separation of concerns, testability, and maintainability.

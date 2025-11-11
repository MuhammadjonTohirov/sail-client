# Auth & Locale Clean Architecture Implementation

## Overview

This document details the Clean Architecture implementation for **Authentication** and **Locale** management utilities previously in `apiUtils.ts`.

Unlike typical API endpoints, these are infrastructure utilities that have been refactored to follow Clean Architecture principles with proper abstractions and use cases.

---

## 1. Authentication Feature

### Core Functionality
- Token storage and retrieval (access & refresh tokens)
- Automatic token refresh on expiry
- Authentication state management
- Secure logout

### Domain Models

#### AuthToken
```typescript
interface AuthToken {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn?: number;
}
```

#### TokenRefreshResult
```typescript
interface TokenRefreshResult {
  readonly accessToken: string;
  readonly success: boolean;
}
```

### Repository Interface (Gateway)

```typescript
interface IAuthRepository {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  saveTokens(tokens: AuthToken): void;
  refreshAccessToken(): Promise<TokenRefreshResult | null>;
  clearAuth(): void;
}
```

### Use Cases

#### GetAccessTokenUseCase
- **Purpose**: Retrieve the current access token
- **Validation**: None
- **Returns**: string | null

#### SaveTokensUseCase
- **Purpose**: Store authentication tokens securely
- **Validation**:
  - `accessToken` must be non-empty
  - `refreshToken` must be non-empty
- **Side Effects**: Dispatches 'auth-changed' event
- **Throws**: Error if validation fails

#### RefreshTokenUseCase
- **Purpose**: Refresh the access token using refresh token
- **Returns**: TokenRefreshResult | null
- **Side Effects**: Updates stored access token on success

#### LogoutUseCase
- **Purpose**: Clear all authentication data
- **Side Effects**:
  - Removes tokens from storage
  - Removes profile from storage
  - Dispatches 'auth-changed' event

### Hook Usage

```typescript
const {
  isAuthenticated,
  loading,
  error,
  getAccessToken,
  saveTokens,
  refreshToken,
  logout,
  checkAuth
} = useAuth();

// Check authentication status
const isLoggedIn = checkAuth();

// Get current token
const token = getAccessToken();

// Save tokens after login
saveTokens({
  accessToken: 'xxx',
  refreshToken: 'yyy'
});

// Refresh token
const newToken = await refreshToken();

// Logout
logout();
```

### Architecture Flow

```
Component
    ↓ uses
useAuth Hook
    ↓ calls
Use Cases (GetAccessToken, SaveTokens, RefreshToken, Logout)
    ↓ depends on
IAuthRepository (interface)
    ↑ implemented by
AuthRepositoryImpl
    ↓ uses
apiUtils functions (getToken, clearAuth, etc.)
    ↓ accesses
localStorage
```

---

## 2. Locale Feature

### Core Functionality
- Detect current locale from URL
- Support for multiple locales
- Default locale fallback

### Repository Interface (Gateway)

```typescript
interface ILocaleRepository {
  getCurrentLocale(): string;
  getSupportedLocales(): string[];
}
```

### Use Cases

#### GetCurrentLocaleUseCase
- **Purpose**: Get the current locale from URL or default
- **Logic**:
  1. Extract first path segment from URL
  2. Check if it's a supported locale
  3. Return locale or default
- **Returns**: string

### Hook Usage

```typescript
const { currentLocale, supportedLocales } = useLocale();

// Current locale (e.g., 'en', 'uz', 'ru')
console.log(currentLocale); // 'uz'

// All supported locales
console.log(supportedLocales); // ['en', 'uz', 'ru']
```

### Architecture Flow

```
Component
    ↓ uses
useLocale Hook
    ↓ calls
GetCurrentLocaleUseCase
    ↓ depends on
ILocaleRepository (interface)
    ↑ implemented by
LocaleRepositoryImpl
    ↓ uses
apiUtils.currentLocale()
    ↓ reads
window.location.pathname
```

---

## SOLID Principles Applied

### Single Responsibility Principle (SRP)
✅ Each use case handles one specific operation
✅ `GetAccessTokenUseCase` - only gets token
✅ `SaveTokensUseCase` - only saves tokens with validation
✅ `RefreshTokenUseCase` - only refreshes token
✅ `LogoutUseCase` - only clears auth

### Open/Closed Principle (OCP)
✅ Domain models are immutable (`readonly` properties)
✅ New use cases can be added without modifying existing ones
✅ Extensible through new implementations

### Liskov Substitution Principle (LSP)
✅ Any implementation of `IAuthRepository` can be substituted
✅ Perfect for testing with mock implementations
✅ Can switch storage mechanisms (localStorage → sessionStorage → memory)

### Interface Segregation Principle (ISP)
✅ `IAuthRepository` - 5 focused methods
✅ `ILocaleRepository` - 2 focused methods
✅ No fat interfaces

### Dependency Inversion Principle (DIP)
✅ Use cases depend on repository interfaces (abstractions)
✅ Use cases don't depend on concrete implementations
✅ High-level modules independent of low-level storage details

---

## Benefits

### 1. Testability

```typescript
// Mock repository for testing
const mockAuthRepo: IAuthRepository = {
  getAccessToken: jest.fn().mockReturnValue('mock-token'),
  getRefreshToken: jest.fn().mockReturnValue('mock-refresh'),
  saveTokens: jest.fn(),
  refreshAccessToken: jest.fn().mockResolvedValue({ accessToken: 'new-token', success: true }),
  clearAuth: jest.fn(),
};

const useCase = new SaveTokensUseCase(mockAuthRepo);
```

### 2. Security
- Tokens never exposed in business logic
- Validation before storage
- Centralized auth management
- Easy to audit

### 3. Maintainability
- Clear separation of concerns
- Changes to storage don't affect business logic
- Easy to switch storage mechanisms

### 4. State Management
- Automatic auth state updates via events
- React hooks provide reactive state
- Consistent auth state across app

---

## State Management in useAuth

The `useAuth` hook provides automatic authentication state management:

```typescript
// Listens to 'auth-changed' events
useEffect(() => {
  checkAuth();

  const handleAuthChange = () => {
    checkAuth();
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('auth-changed', handleAuthChange);
    return () => window.removeEventListener('auth-changed', handleAuthChange);
  }
}, [checkAuth]);
```

This ensures that:
- Login updates state immediately
- Logout updates state immediately
- Token refresh updates state automatically
- Multiple components stay in sync

---

## Error Handling

### Use Case Level (Business Rules)
```typescript
// SaveTokensUseCase
if (!tokens.accessToken || tokens.accessToken.trim().length === 0) {
  throw new Error('Access token is required');
}
if (!tokens.refreshToken || tokens.refreshToken.trim().length === 0) {
  throw new Error('Refresh token is required');
}
```

### Hook Level (User Feedback)
```typescript
try {
  saveTokensUseCase.execute(tokens);
  setIsAuthenticated(true);
} catch (err) {
  const errorMessage = err instanceof Error ? err.message : 'Failed to save tokens';
  setError(errorMessage);
  throw err; // Re-throw for component handling
}
```

### Component Level (UI Display)
```typescript
const { error, isAuthenticated } = useAuth();

{error && <div className="error">{error}</div>}
{isAuthenticated && <div>Welcome!</div>}
```

---

## Token Refresh Flow

```
1. API request returns 401
2. apiFetch intercepts 401
3. Calls refreshAccessToken()
4. RefreshTokenUseCase executes
5. AuthRepositoryImpl calls API
6. New token saved to localStorage
7. 'auth-changed' event dispatched
8. useAuth hook updates isAuthenticated
9. Original request retried with new token
```

This flow is handled transparently by the infrastructure layer, with proper abstraction.

---

## Migration Notes

### Old API Usage
```typescript
import { getToken, clearAuth, refreshAccessToken } from '@/lib/apiUtils';

const token = getToken();
clearAuth();
const newToken = await refreshAccessToken();
```

### New Clean Architecture Usage
```typescript
import { useAuth } from '@/hooks/useAuth';

const { getAccessToken, logout, refreshToken } = useAuth();

const token = getAccessToken();
logout();
const newToken = await refreshToken();
```

### Benefits of Migration
- ✅ Better testability
- ✅ Reactive state management
- ✅ Validation built-in
- ✅ Consistent error handling
- ✅ SOLID compliance

---

## File Structure

```
domain/
  models/
    AuthToken.ts
    UserProfile.ts
  repositories/
    IAuthRepository.ts
    ILocaleRepository.ts
  usecases/
    auth/
      GetAccessTokenUseCase.ts
      SaveTokensUseCase.ts
      RefreshTokenUseCase.ts
      LogoutUseCase.ts
    locale/
      GetCurrentLocaleUseCase.ts

data/
  models/
    AuthDTO.ts
  mappers/
    AuthMapper.ts
  repositories/
    AuthRepositoryImpl.ts
    LocaleRepositoryImpl.ts

hooks/
  useAuth.ts
  useLocale.ts

lib/
  apiUtils.ts (still used internally)
```

---

## Testing Examples

### Unit Test: SaveTokensUseCase

```typescript
describe('SaveTokensUseCase', () => {
  let mockRepo: IAuthRepository;
  let useCase: SaveTokensUseCase;

  beforeEach(() => {
    mockRepo = {
      saveTokens: jest.fn(),
      // ... other methods
    } as any;
    useCase = new SaveTokensUseCase(mockRepo);
  });

  it('should save valid tokens', () => {
    const tokens = {
      accessToken: 'valid-access',
      refreshToken: 'valid-refresh'
    };

    useCase.execute(tokens);

    expect(mockRepo.saveTokens).toHaveBeenCalledWith(tokens);
  });

  it('should throw error for empty access token', () => {
    const tokens = {
      accessToken: '',
      refreshToken: 'valid-refresh'
    };

    expect(() => useCase.execute(tokens)).toThrow('Access token is required');
    expect(mockRepo.saveTokens).not.toHaveBeenCalled();
  });

  it('should throw error for empty refresh token', () => {
    const tokens = {
      accessToken: 'valid-access',
      refreshToken: ''
    };

    expect(() => useCase.execute(tokens)).toThrow('Refresh token is required');
    expect(mockRepo.saveTokens).not.toHaveBeenCalled();
  });
});
```

### Integration Test: useAuth Hook

```typescript
describe('useAuth', () => {
  it('should update isAuthenticated when tokens are saved', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);

    act(() => {
      result.current.saveTokens({
        accessToken: 'test-access',
        refreshToken: 'test-refresh'
      });
    });

    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should clear authentication on logout', () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.saveTokens({
        accessToken: 'test-access',
        refreshToken: 'test-refresh'
      });
    });

    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
  });
});
```

---

## Summary

### Auth Feature
- ✅ 4 use cases (Get, Save, Refresh, Logout)
- ✅ Token validation
- ✅ Automatic state management
- ✅ Event-driven updates
- ✅ Secure abstraction

### Locale Feature
- ✅ 1 use case (GetCurrentLocale)
- ✅ URL-based detection
- ✅ Default locale fallback
- ✅ Multi-locale support

Both features now follow Clean Architecture principles with proper separation of concerns, testability, and maintainability. The infrastructure utilities have been elevated to first-class features with proper domain models and use cases.

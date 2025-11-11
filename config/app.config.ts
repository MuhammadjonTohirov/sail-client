/**
 * Application Configuration
 *
 * Central configuration for app branding, theme, and global settings.
 * Update these values to customize your marketplace application.
 */

export const appConfig = {
  // App Branding
  name: 'Sail',
  shortName: 'MHub',
  description: 'Buy and sell anything locally',
  tagline: 'Your local marketplace for everything',

  // SEO & Meta
  seo: {
    defaultTitle: 'Sail - Buy & Sell Locally',
    titleTemplate: '%s | Sail',
    description: 'Discover great deals on new and used items. Buy, sell, and connect with your local community.',
    keywords: ['marketplace', 'classifieds', 'buy', 'sell', 'local', 'trade'],
  },

  // Contact & Social
  contact: {
    email: 'support@markethub.uz',
    phone: '+998 93 585 24 15',
    address: 'Tashkent, Uzbekistan',
  },

  social: {
    facebook: 'https://facebook.com/markethub',
    instagram: 'https://instagram.com/markethub',
    twitter: 'https://twitter.com/markethub',
    telegram: 'https://t.me/markethub',
  },

  // Theme Colors
  theme: {
    colors: {
      // Primary brand color
      primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8ff',
        500: '#0ea5e9',  // Main primary color
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
      },

      // Secondary/accent color
      secondary: {
        50: '#fdf4ff',
        100: '#fae8ff',
        200: '#f5d0fe',
        300: '#f0abfc',
        400: '#e879f9',
        500: '#d946ef',  // Main secondary color
        600: '#c026d3',
        700: '#a21caf',
        800: '#86198f',
        900: '#701a75',
      },

      // Success color (for active listings, success messages)
      success: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',  // Main success color
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
      },

      // Warning color (for promotions, featured items)
      warning: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',  // Main warning color
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
      },

      // Error/danger color
      error: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',  // Main error color
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
      },

      // Neutral/gray colors
      neutral: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
      },
    },

    // Font configuration
    fonts: {
      sans: 'Inter, system-ui, -apple-system, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },

    // Spacing scale (multiplier for Tailwind spacing)
    spacing: {
      containerMaxWidth: '1200px',
      headerHeight: '64px',
      footerHeight: 'auto',
    },

    // Border radius
    borderRadius: {
      small: '4px',
      medium: '8px',
      large: '12px',
      xl: '16px',
    },
  },

  // Feature Flags
  features: {
    enableChat: true,
    enablePromotions: true,
    enableFavorites: true,
    enableSavedSearches: true,
    enableUserRatings: true,
    enableSocialAuth: true,
    enableMapView: true,
    enableDarkMode: false,
  },

  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    timeout: 30000, // 30 seconds
  },

  // Pagination & Limits
  pagination: {
    itemsPerPage: 24,
    maxItemsPerPage: 100,
  },

  // Upload Limits
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxImages: 10,
    allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  },

  // Localization
  i18n: {
    defaultLocale: 'uz',
    locales: ['uz', 'ru', 'en'],
    currency: 'UZS',
    currencySymbol: 'so\'m',
  },

  // Maps
  maps: {
    defaultCenter: {
      lat: 41.2995,
      lng: 69.2401,
    },
    defaultZoom: 12,
  },
  
} as const;

// Type exports for TypeScript
export type AppConfig = typeof appConfig;
export type ThemeColors = typeof appConfig.theme.colors;
export type Features = typeof appConfig.features;

function trustedImageUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  return `${appConfig.api.baseUrl}/${url.replace(/^\/+/, '')}`;
}
export { trustedImageUrl };

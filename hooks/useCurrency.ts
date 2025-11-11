"use client";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CurrencyRepositoryImpl } from '../data/repositories/CurrencyRepositoryImpl';
import { GetCurrencyConfigUseCase } from '../domain/usecases/currency/GetCurrencyConfigUseCase';
import type { Currency, ExchangeRates } from '../domain/models/Currency';

const repository = new CurrencyRepositoryImpl();
const getCurrencyConfigUseCase = new GetCurrencyConfigUseCase(repository);

interface CurrencyState {
  // Configuration from server
  currencies: Currency[];
  exchangeRates: ExchangeRates;
  defaultCurrency: string;

  // User's selected currency preference
  selectedCurrency: string;

  // Loading state
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadConfig: () => Promise<void>;
  setSelectedCurrency: (currency: string) => void;
  toggleCurrency: () => void;
  convertPrice: (amount: number, fromCurrency: string) => number;
  formatPrice: (amount: number, currency: string) => string;
}

export const useCurrency = create<CurrencyState>()(
  persist(
    (set, get) => ({
      // Initial state
      currencies: [],
      exchangeRates: {},
      defaultCurrency: 'UZS',
      selectedCurrency: 'UZS',
      isLoaded: false,
      isLoading: false,
      error: null,

      // Load currency configuration from server
      loadConfig: async () => {
        const state = get();

        // Don't reload if already loaded
        if (state.isLoaded || state.isLoading) {
          console.log('Currency config already loaded or loading, skipping');
          return;
        }

        set({ isLoading: true, error: null });
        console.log('Loading currency config from API...');

        try {
          const config = await getCurrencyConfigUseCase.execute();

          console.log('Currency config loaded:', {
            currencies: config.currencies?.length || 0,
            exchangeRates: Object.keys(config.exchangeRates || {}).length,
            defaultCurrency: config.defaultCurrency
          });

          set({
            currencies: config.currencies,
            exchangeRates: config.exchangeRates,
            defaultCurrency: config.defaultCurrency,
            isLoaded: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('Failed to load currency config:', error);
          set({
            isLoading: false,
            error: 'Failed to load currency configuration',
          });
        }
      },

      // Set user's preferred currency
      setSelectedCurrency: (currency: string) => {
        set({ selectedCurrency: currency });
      },

      // Toggle between available currencies (USD <-> UZS)
      toggleCurrency: () => {
        const state = get();
        const currentCurrency = state.selectedCurrency;

        // Find another active currency to toggle to
        const otherCurrency = state.currencies.find(
          (c) => c.code !== currentCurrency
        );

        if (otherCurrency) {
          set({ selectedCurrency: otherCurrency.code });
        }
      },

      // Convert price from one currency to user's selected currency
      convertPrice: (amount: number, fromCurrency: string): number => {
        const state = get();
        const toCurrency = state.selectedCurrency;

        // If same currency, no conversion needed
        if (fromCurrency === toCurrency) {
          return amount;
        }

        // Get exchange rate
        const rate = state.exchangeRates[fromCurrency]?.[toCurrency];

        if (!rate) {
          console.warn(`No exchange rate found for ${fromCurrency} -> ${toCurrency}`);
          return amount;
        }

        return amount * rate;
      },

      // Format price with currency symbol
      formatPrice: (amount: number, currencyCode: string): string => {
        const state = get();
        const currency = state.currencies.find((c) => c.code === currencyCode);

        if (!currency) {
          return amount.toLocaleString();
        }

        // Format number with proper locale
        const formatted = amount.toLocaleString('ru-RU', {
          minimumFractionDigits: 0,
          maximumFractionDigits: currencyCode === 'USD' ? 2 : 0,
        });

        // Add currency symbol
        if (currencyCode === 'USD') {
          return `$${formatted}`;
        } else if (currencyCode === 'UZS') {
          return `${formatted} ${currency.symbol}`;
        }

        return `${formatted} ${currency.symbol}`;
      },
    }),
    {
      name: 'currency-storage',
      // Only persist user's selected currency, not the config
      partialize: (state) => ({
        selectedCurrency: state.selectedCurrency,
      }),
    }
  )
);

"use client";
import { useEffect } from 'react';
import { useCurrency } from '@/hooks';

export default function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const loadConfig = useCurrency((state) => state.loadConfig);

  useEffect(() => {
    // Load currency configuration on mount
    loadConfig();
  }, [loadConfig]);

  return <>{children}</>;
}

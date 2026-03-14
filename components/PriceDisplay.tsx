"use client";
import { useCurrency } from '@/hooks/useCurrency';

interface PriceDisplayProps {
  amount: number;
  currency: string;
  className?: string;
  showOriginal?: boolean;
  /** Override the target currency for conversion (e.g. from search filter). */
  targetCurrency?: string;
}

export default function PriceDisplay({
  amount,
  currency,
  className = '',
  showOriginal = false,
  targetCurrency,
}: PriceDisplayProps) {
  const { selectedCurrency, exchangeRates, formatPrice } = useCurrency();

  // Use targetCurrency if provided, otherwise fall back to global selectedCurrency.
  // Empty string means "no filter" — show original currency.
  const target = targetCurrency || selectedCurrency;

  // Convert
  let convertedAmount = amount;
  let displayCurrency = currency;

  if (target && target !== currency) {
    const rate = exchangeRates[currency]?.[target];
    if (rate) {
      convertedAmount = amount * rate;
      displayCurrency = target;
    }
    // No rate available — keep original amount and currency
  } else if (target === currency) {
    displayCurrency = currency;
  }

  const formattedPrice = formatPrice(convertedAmount, displayCurrency);

  const showOriginalCurrency = showOriginal && currency !== displayCurrency;
  const originalFormatted = showOriginalCurrency
    ? formatPrice(amount, currency)
    : null;

  return (
    <div className={className}>
      <span>{formattedPrice}</span>
      {showOriginalCurrency && originalFormatted && (
        <span className="text-sm text-gray-500 ml-2">
          ({originalFormatted})
        </span>
      )}
    </div>
  );
}

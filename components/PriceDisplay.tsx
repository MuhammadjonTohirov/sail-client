"use client";
import { useCurrency } from '@/hooks/useCurrency';

interface PriceDisplayProps {
  amount: number;
  currency: string;
  className?: string;
  showOriginal?: boolean; // Show original currency if different from selected
}

export default function PriceDisplay({
  amount,
  currency,
  className = '',
  showOriginal = false,
}: PriceDisplayProps) {
  const { selectedCurrency, convertPrice, formatPrice } = useCurrency();

  // Convert to user's selected currency
  const convertedAmount = convertPrice(amount, currency);

  // Format the converted price
  const formattedPrice = formatPrice(convertedAmount, selectedCurrency);

  // Show original currency if different and showOriginal is true
  const showOriginalCurrency = showOriginal && currency !== selectedCurrency;
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

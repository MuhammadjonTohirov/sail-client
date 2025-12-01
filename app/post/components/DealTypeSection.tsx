"use client";

import Dropdown from '@/components/ui/Dropdown';
import type { TranslateFn } from './types';

interface DealTypeSectionProps {
  t: TranslateFn;
  dealType: 'sell' | 'exchange' | 'free';
  setDealType: (value: 'sell' | 'exchange' | 'free') => void;
  price: string;
  setPrice: (value: string) => void;
  priceCurrency: string;
  setPriceCurrency: (value: string) => void;
  currencyOptions: string[];
  negotiable: boolean;
  setNegotiable: (value: boolean) => void;
}

export function DealTypeSection({
  t,
  dealType,
  setDealType,
  price,
  setPrice,
  priceCurrency,
  setPriceCurrency,
  currencyOptions,
  negotiable,
  setNegotiable,
}: DealTypeSectionProps) {
  const dealTypes: Array<{ key: 'sell' | 'exchange' | 'free'; label: string }> = [
    { key: 'sell', label: t('post.dealTypeSell') },
    { key: 'exchange', label: t('post.dealTypeExchange') },
    { key: 'free', label: t('post.dealTypeFree') },
  ];

  return (
    <div className="form-card">
      <div className="row" style={{ gap: 8 }}>
        {dealTypes.map(opt => (
          <button
            key={opt.key}
            type="button"
            className="btn-outline"
            onClick={() => setDealType(opt.key)}
            style={{ background: dealType === opt.key ? '#e9f8f7' : '#fff' }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {dealType === 'sell' && (
        <div style={{ marginTop: 12 }}>
          <div className="row">
            <div className="field" style={{ width: 300 }}>
              <label>{t('post.priceLabel')}</label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                disabled={negotiable}
              />
            </div>
            <div className="field">
              <label>{t('post.currencyLabel')}</label>
              <Dropdown
                value={priceCurrency}
                onChange={(v) => setPriceCurrency((v as string) || currencyOptions[0])}
                options={currencyOptions.map((value) => ({ value, label: value }))}
                style={{ height: '50px' }}
                align="left"
              />
            </div>
          </div>
          <div className="row" style={{ alignItems: 'center' }}>
            <label className="muted">{t('post.negotiable')}</label>
            <input
              type="checkbox"
              checked={negotiable}
              onChange={e => setNegotiable(e.target.checked)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

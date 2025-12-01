"use client";

import type { TranslateFn } from './types';

interface AdditionalInfoSectionProps {
  t: TranslateFn;
  sellerType: 'person' | 'business';
  setSellerType: (value: 'person' | 'business') => void;
  condition: 'new' | 'used';
  setCondition: (value: 'new' | 'used') => void;
}

export function AdditionalInfoSection({
  t,
  sellerType,
  setSellerType,
  condition,
  setCondition,
}: AdditionalInfoSectionProps) {
  return (
    <div className="form-card">
      <h3>{t('post.additionalInfo')}</h3>
      <div className="field">
        <label>{t('post.sellerTypeLabel')}</label>
        <div className="row" style={{ gap: 8 }}>
          <button
            type="button"
            className="btn-outline"
            onClick={() => setSellerType('person')}
            style={{ background: sellerType === 'person' ? '#e9f8f7' : '#fff' }}
          >
            {t('post.sellerTypePerson')}
          </button>
          <button
            type="button"
            className="btn-outline"
            onClick={() => setSellerType('business')}
            style={{ background: sellerType === 'business' ? '#e9f8f7' : '#fff' }}
          >
            {t('post.sellerTypeBusiness')}
          </button>
        </div>
      </div>
      <div className="field">
        <label>{t('post.conditionLabel')}</label>
        <div className="row" style={{ gap: 8 }}>
          <button
            type="button"
            className="btn-outline"
            onClick={() => setCondition('used')}
            style={{ background: condition === 'used' ? '#e9f8f7' : '#fff' }}
          >
            {t('post.conditionUsed')}
          </button>
          <button
            type="button"
            className="btn-outline"
            onClick={() => setCondition('new')}
            style={{ background: condition === 'new' ? '#e9f8f7' : '#fff' }}
          >
            {t('post.conditionNew')}
          </button>
        </div>
      </div>
    </div>
  );
}

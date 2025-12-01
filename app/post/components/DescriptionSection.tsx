"use client";

import type { TranslateFn } from './types';

interface DescriptionSectionProps {
  t: TranslateFn;
  description: string;
  maxLength: number;
  onChange: (value: string) => void;
}

export function DescriptionSection({
  t,
  description,
  maxLength,
  onChange,
}: DescriptionSectionProps) {
  const value = description.slice(0, maxLength);

  return (
    <div className="form-card">
      <div className="field">
        <label>{t('post.descriptionLabel')}</label>
        <textarea
          rows={6}
          value={value}
          onChange={e => onChange(e.target.value.slice(0, maxLength))}
          placeholder={t('post.descriptionPlaceholder')}
        ></textarea>
        <div className="muted" style={{ textAlign: 'right' }}>
          {value.length}/{maxLength}
        </div>
      </div>
    </div>
  );
}

"use client";

import type { TranslateFn } from './types';

interface ContactInfoSectionProps {
  t: TranslateFn;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  onChangeName: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangePhone: (value: string) => void;
  nameMaxLength: number;
  emailMaxLength: number;
  phoneMaxLength: number;
}

export function ContactInfoSection({
  t,
  contactName,
  contactEmail,
  contactPhone,
  onChangeName,
  onChangeEmail,
  onChangePhone,
  nameMaxLength,
  emailMaxLength,
  phoneMaxLength,
}: ContactInfoSectionProps) {
  return (
    <div className="form-card">
      <h3>{t('post.contactInfo')}</h3>
      <p className="muted" style={{ marginTop: -8, marginBottom: 16 }}>
        {t('post.contactInfoNote')}
      </p>
      <div className="field">
        <label>{t('post.contactNameLabel')}*</label>
        <input
          value={contactName}
          onChange={ e => 
            onChangeName(e.target.value.slice(0, nameMaxLength))
          }
          placeholder={t('post.contactNamePlaceholder')}
        />
      </div>
      <div className="field">
        <label>{t('post.contactEmailLabel')}</label>
        <input
          type="email"
          value={contactEmail}
          onChange={e => onChangeEmail(e.target.value.slice(0, emailMaxLength))}
          placeholder={t('post.contactEmailPlaceholder')}
        />
      </div>
      <div className="field">
        <label>{t('post.contactPhoneLabel')}</label>
        <input
          type="tel"
          value={contactPhone}
          onChange={e => onChangePhone(e.target.value.slice(0, phoneMaxLength))}
          placeholder={t('post.contactPhonePlaceholder')}
        />
      </div>
    </div>
  );
}

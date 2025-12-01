"use client";

import AttributesForm from '@/components/listing/AttributesForm';
import type { Attribute } from '@/domain/models/Attribute';
import type { TranslateFn } from './types';

interface AttributesSectionProps {
  t: TranslateFn;
  show: boolean;
  attrs: Attribute[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  locale: string;
}

export function AttributesSection({
  t,
  show,
  attrs,
  values,
  onChange,
}: AttributesSectionProps) {
  if (!show || !attrs.length) return null;

  return (
    <div className="form-card">
      <h3>{t('post.characteristics')}</h3>
      <AttributesForm
        attrs={attrs as any}
        values={values}
        onChange={onChange}
      />
    </div>
  );
}

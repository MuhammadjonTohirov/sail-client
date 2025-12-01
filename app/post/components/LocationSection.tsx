"use client";

import LocationPicker from '@/components/ui/LocationPicker';
import type { TranslateFn } from './types';

interface LocationSectionProps {
  t: TranslateFn;
  locationPath: string;
  pickerOpen: boolean;
  onOpenPicker: () => void;
  onClosePicker: () => void;
  onSelectLocation: (payload: { id: number; path: string }) => void;
}

export function LocationSection({
  t,
  locationPath,
  pickerOpen,
  onOpenPicker,
  onClosePicker,
  onSelectLocation,
}: LocationSectionProps) {
  return (
    <div className="form-card">
      <h3>{t('post.locationTitle')}</h3>
      <div className="field">
        <label>{t('post.selectLocation')}</label>
        <button
          type="button"
          className="btn-outline"
          onClick={onOpenPicker}
          style={{ flexWrap: 'wrap', textAlign: 'left', minWidth: '100px', maxWidth: '300px' }}
        >
          {locationPath || t('post.selectRegionCity')}
        </button>
      </div>
      <LocationPicker
        open={pickerOpen}
        onClose={onClosePicker}
        onSelect={onSelectLocation}
      />
    </div>
  );
}

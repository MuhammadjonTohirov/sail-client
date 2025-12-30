"use client";

import { useState } from 'react';
import LocationPicker from '@/components/ui/LocationPicker';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Taxonomy } from '@/lib/taxonomyApi';
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
  const { requestLocation, loading: geoLoading, error: geoError, isSupported } = useGeolocation();
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleUseMyLocation = async () => {
    setLocationError(null);
    setDetectingLocation(true);

    try {
      const position = await requestLocation();
      if (!position) {
        if (geoError === 'permission_denied') {
          setLocationError(t('post.locationPermissionDenied', 'Location access denied'));
        } else {
          setLocationError(t('post.locationDetectionFailed', 'Could not detect location'));
        }
        setDetectingLocation(false);
        return;
      }

      const result = await Taxonomy.reverseGeocode(position.lat, position.lon);
      if (result) {
        onSelectLocation({ id: result.id, path: result.path });
        setLocationError(null);
      } else {
        setLocationError(t('post.noLocationFound', 'No location found for your coordinates'));
      }
    } catch (e) {
      setLocationError(t('post.locationDetectionFailed', 'Could not detect location'));
    } finally {
      setDetectingLocation(false);
    }
  };

  const isLoading = geoLoading || detectingLocation;

  return (
    <div className="form-card">
      <h3>{t('post.locationTitle')}</h3>
      <div className="field">
        <label>{t('post.selectLocation')}</label>
        <div className="location-buttons">
          <button
            type="button"
            className="btn-outline"
            onClick={onOpenPicker}
            style={{ flexWrap: 'wrap', textAlign: 'left', minWidth: '100px', maxWidth: '300px' }}
          >
            {locationPath || t('post.selectRegionCity')}
          </button>

          {isSupported && (
            <button
              type="button"
              className="btn-outline location-detect-btn"
              onClick={handleUseMyLocation}
              disabled={isLoading}
              title={t('post.useMyLocation', 'Use my location')}
            >
              {isLoading ? (
                <span className="location-spinner" />
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                </svg>
              )}
              <span className="location-btn-text">{t('post.useMyLocation', 'Use my location')}</span>
            </button>
          )}
        </div>

        {locationError && (
          <p className="location-error">{locationError}</p>
        )}
      </div>
      <LocationPicker
        open={pickerOpen}
        onClose={onClosePicker}
        onSelect={onSelectLocation}
      />
    </div>
  );
}

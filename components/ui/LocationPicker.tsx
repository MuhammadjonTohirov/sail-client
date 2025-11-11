'use client';

import { useState, useEffect } from 'react';
import { Taxonomy } from '@/lib/api';

interface Location {
  id: number;
  name: string;
  name_ru?: string;
  name_uz?: string;
  kind: string;
  parent?: number;
}

interface SelectedLocation {
  id: number;
  name: string;
  path: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (location: SelectedLocation) => void;
  locale?: 'ru' | 'uz';
}

export default function LocationPicker({ open, onClose, onSelect, locale = 'ru' }: Props) {
  const [regions, setRegions] = useState<Location[]>([]);
  const [cities, setCities] = useState<Location[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Location | null>(null);
  const [selectedCity, setSelectedCity] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);

  // Helper function to get display name based on locale
  const getDisplayName = (location: Location) => {
    if (locale === 'uz') {
      return location.name_uz || location.name;
    }
    return location.name_ru || location.name;
  };

  // Helper function for labels
  const label = (ru: string, uz: string) => (locale === 'uz' ? uz : ru);

  // Load regions on mount
  useEffect(() => {
    if (open) {
      loadRegions();
    }
  }, [open]);

  const loadRegions = async () => {
    setLoading(true);
    try {
      // Get all locations to find Uzbekistan
      const allLocs = await Taxonomy.locations();
      const uzbekistan = allLocs.find((loc: Location) =>
        loc.kind === 'COUNTRY' && (loc.name === 'Uzbekistan' || loc.name === 'O\'zbekiston')
      );

      if (uzbekistan) {
        // Get children of Uzbekistan (regions)
        const regionsList = await Taxonomy.locations(uzbekistan.id);
        const filteredRegions = regionsList.filter((r: Location) => r.kind === 'REGION');

        // Sort alphabetically by display name
        filteredRegions.sort((a: Location, b: Location) => {
          const nameA = getDisplayName(a);
          const nameB = getDisplayName(b);
          return nameA.localeCompare(nameB, locale);
        });

        setRegions(filteredRegions);
      } else {
        // Fallback: filter regions from all locations
        const filteredRegions = allLocs.filter((loc: Location) => loc.kind === 'REGION');
        filteredRegions.sort((a: Location, b: Location) => {
          const nameA = getDisplayName(a);
          const nameB = getDisplayName(b);
          return nameA.localeCompare(nameB, locale);
        });
        setRegions(filteredRegions);
      }
    } catch (error) {
      console.error('Failed to load regions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegionClick = async (region: Location) => {
    setSelectedRegion(region);
    setSelectedCity(null);
    setCityLoading(true);

    try {
      const citiesList = await Taxonomy.locations(region.id);
      // Filter only DISTRICT kind (cities/districts for selection)
      const filteredCities = citiesList.filter((c: Location) => c.kind === 'DISTRICT');
      
      // Sort alphabetically
      filteredCities.sort((a: Location, b: Location) => {
        const nameA = getDisplayName(a);
        const nameB = getDisplayName(b);
        return nameA.localeCompare(nameB, locale);
      });

      setCities(filteredCities);
    } catch (error) {
      console.error('Failed to load cities:', error);
      setCities([]);
    } finally {
      setCityLoading(false);
    }
  };

  const handleCityClick = (city: Location) => {
    setSelectedCity(city);
  };

  const handleConfirm = () => {
    if (selectedCity && selectedRegion) {
      const regionName = getDisplayName(selectedRegion);
      const cityName = getDisplayName(selectedCity);

      onSelect({
        id: selectedCity.id,
        name: cityName,
        path: `${regionName} / ${cityName}`
      });

      // Reset state
      setSelectedRegion(null);
      setSelectedCity(null);
      setCities([]);

      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedRegion(null);
    setSelectedCity(null);
    setCities([]);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={handleCancel}>
      <div className="modal location-picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {label('Выберите местоположение', 'Manzilni tanlang')}
          </h2>
          <button className="modal-close" onClick={handleCancel}>×</button>
        </div>

        <div className="modal-body">
          <div className="location-picker">
            {/* Regions Column */}
            <div className="location-col">
              <div className="location-col-header">
                {label('Регион', 'Viloyat')}
              </div>
              <div className="location-list">
                {loading ? (
                  <div className="location-loading">
                    <div className="animate-spin">⏳</div>
                  </div>
                ) : regions.length === 0 ? (
                  <div className="location-placeholder">
                    {label('Нет регионов', 'Viloyatlar yo\'q')}
                  </div>
                ) : (
                  regions.map((region) => (
                    <button
                      key={region.id}
                      className={`location-item ${selectedRegion?.id === region.id ? 'is-active' : ''}`}
                      onClick={() => handleRegionClick(region)}
                    >
                      <span>{getDisplayName(region)}</span>
                      <span className="location-arrow">›</span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Cities Column */}
            <div className="location-col">
              <div className="location-col-header">
                {label('Город / Район', 'Shahar / Tuman')}
              </div>
              <div className="location-list">
                {!selectedRegion ? (
                  <div className="location-placeholder">
                    {label('Выберите регион', 'Viloyatni tanlang')}
                  </div>
                ) : cityLoading ? (
                  <div className="location-loading">
                    <div className="animate-spin">⏳</div>
                  </div>
                ) : cities.length === 0 ? (
                  <div className="location-placeholder">
                    {label('Нет городов', 'Shaharlar yo\'q')}
                  </div>
                ) : (
                  cities.map((city) => (
                    <button
                      key={city.id}
                      className={`location-item ${selectedCity?.id === city.id ? 'is-active' : ''}`}
                      onClick={() => handleCityClick(city)}
                    >
                      <span>{getDisplayName(city)}</span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Selected Location Preview Column */}
            <div className="location-col">
              <div className="location-col-header">
                {label('Выбрано', 'Tanlangan')}
              </div>
              <div className="location-list">
                {!selectedRegion && !selectedCity ? (
                  <div className="location-placeholder">
                    {label('Выберите местоположение', 'Manzilni tanlang')}
                  </div>
                ) : (
                  <div style={{ padding: '16px' }}>
                    {selectedRegion && (
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>
                          {label('Регион', 'Viloyat')}
                        </div>
                        <div style={{ fontWeight: '600' }}>
                          {getDisplayName(selectedRegion)}
                        </div>
                      </div>
                    )}
                    {selectedCity && (
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>
                          {label('Город / Район', 'Shahar / Tuman')}
                        </div>
                        <div style={{ fontWeight: '600' }}>
                          {getDisplayName(selectedCity)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={handleCancel}>
            {label('Отмена', 'Bekor qilish')}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedCity}
          >
            {label('Выбрать', 'Tanlash')}
          </button>
        </div>
      </div>
    </div>
  );
}

import { IGeocodingRepository } from '../../domain/repositories/IGeocodingRepository';
import { GeoLocation, GeocodeResult } from '../../domain/models/GeoLocation';

export class GeocodingRepositoryImpl implements IGeocodingRepository {
  private cache = new Map<string, GeoLocation>();

  async geocode(locationName: string): Promise<GeoLocation | null> {
    // Check cache first
    const cacheKey = locationName.toLowerCase().trim();
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // Use Nominatim API for geocoding
      const encodedLocation = encodeURIComponent(locationName);
      const url = `https://nominatim.openstreetmap.org/search?q=${encodedLocation}&polygon_geojson=1&format=jsonv2&limit=1`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'OLX-Clone-App/1.0',
        },
      });

      if (!response.ok) {
        console.error('Geocoding API error:', response.status, response.statusText);
        return null;
      }

      const data: GeocodeResult[] = await response.json();

      if (!data || data.length === 0) {
        return null;
      }

      const result = data[0];
      const geoLocation: GeoLocation = {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        displayName: result.display_name,
        placeId: result.place_id,
        category: result.category,
        type: result.type,
        addressType: result.addresstype,
      };

      // Cache the result
      this.cache.set(cacheKey, geoLocation);

      return geoLocation;
    } catch (error) {
      console.error('Failed to geocode location:', error);
      return null;
    }
  }
}

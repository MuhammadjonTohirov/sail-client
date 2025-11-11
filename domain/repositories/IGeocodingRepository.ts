import { GeoLocation } from '../models/GeoLocation';

export interface IGeocodingRepository {
  /**
   * Geocode a location name to get coordinates
   * @param locationName - The name of the location to geocode
   * @returns GeoLocation with lat/lon or null if not found
   */
  geocode(locationName: string): Promise<GeoLocation | null>;
}

import { IGeocodingRepository } from '../../repositories/IGeocodingRepository';
import { GeoLocation } from '../../models/GeoLocation';

export class GeocodeLocationUseCase {
  constructor(private readonly repository: IGeocodingRepository) {}

  async execute(locationName: string): Promise<GeoLocation | null> {
    if (!locationName || locationName.trim() === '') {
      return null;
    }

    return await this.repository.geocode(locationName);
  }
}

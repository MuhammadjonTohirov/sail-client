import { ITaxonomyRepository } from '../../repositories/ITaxonomyRepository';
import { Location } from '../../models/Location';

export class GetLocationsUseCase {
  constructor(private readonly repository: ITaxonomyRepository) {}

  async execute(parentId?: number, language?: string): Promise<Location[]> {
    return await this.repository.getLocations(parentId, language);
  }
}

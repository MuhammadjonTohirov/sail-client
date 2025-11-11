import { ITaxonomyRepository } from '../../domain/repositories/ITaxonomyRepository';
import { Category } from '../../domain/models/Category';
import { Attribute } from '../../domain/models/Attribute';
import { Location } from '../../domain/models/Location';
import { CategoryDTO, AttributeDTO, LocationDTO } from '../models/TaxonomyDTO';
import { TaxonomyMapper } from '../mappers/TaxonomyMapper';
import { Taxonomy } from '../../lib/taxonomyApi';

export class TaxonomyRepositoryImpl implements ITaxonomyRepository {
  async getCategories(language?: string): Promise<Category[]> {
    const dtos: CategoryDTO[] = await Taxonomy.categories();
    return TaxonomyMapper.categoriesToDomain(dtos);
  }

  async getCategoryAttributes(categoryId: number, language?: string): Promise<Attribute[]> {
    const dtos: AttributeDTO[] = await Taxonomy.attributes(categoryId);
    return TaxonomyMapper.attributesToDomain(dtos);
  }

  async getLocations(parentId?: number, language?: string): Promise<Location[]> {
    const dtos: LocationDTO[] = await Taxonomy.locations(parentId);
    return TaxonomyMapper.locationsToDomain(dtos);
  }
}

import { ITaxonomyRepository } from '../../repositories/ITaxonomyRepository';
import { Attribute } from '../../models/Attribute';

export class GetCategoryAttributesUseCase {
  constructor(private readonly repository: ITaxonomyRepository) {}

  async execute(categoryId: number, language?: string): Promise<Attribute[]> {
    if (!categoryId || categoryId <= 0) {
      throw new Error('Valid category ID is required');
    }

    return await this.repository.getCategoryAttributes(categoryId, language);
  }
}

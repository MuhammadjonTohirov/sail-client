import { ITaxonomyRepository } from '../../repositories/ITaxonomyRepository';
import { Category } from '../../models/Category';

export class GetCategoriesUseCase {
  constructor(private readonly repository: ITaxonomyRepository) {}

  async execute(language?: string): Promise<Category[]> {
    return await this.repository.getCategories(language);
  }
}

import { IListingsRepository } from '../../repositories/IListingsRepository';

export class DeleteListingUseCase {
  constructor(private readonly repository: IListingsRepository) {}

  async execute(id: number): Promise<void> {
    return this.repository.deleteListing(id);
  }
}

import { IListingsRepository } from '../../repositories/IListingsRepository';

export class TrackInterestUseCase {
  constructor(private readonly repository: IListingsRepository) {}

  async execute(id: number): Promise<void> {
    return this.repository.trackInterest(id);
  }
}

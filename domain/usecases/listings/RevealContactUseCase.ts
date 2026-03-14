import { RevealContactResult } from '../../models/Listing';
import { IListingsRepository } from '../../repositories/IListingsRepository';

export class RevealContactUseCase {
  constructor(private readonly repository: IListingsRepository) {}

  async execute(id: number): Promise<RevealContactResult> {
    return this.repository.revealContact(id);
  }
}

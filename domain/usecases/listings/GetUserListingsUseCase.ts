import { IListingsRepository } from '../../repositories/IListingsRepository';
import { UserListingsParams } from '../../models/UserListingsParams';
import { Listing } from '../../models/Listing';
import { SearchResult } from '@/domain/models/SearchResult';
import { SearchListing } from '@/domain/models/SearchListing';

export class GetUserListingsUseCase {
  constructor(private readonly repository: IListingsRepository) {}

  async execute(params: UserListingsParams): Promise<SearchListing[]> {
    if (!params.userId || params.userId <= 0) {
      throw new Error('Invalid user ID');
    }
    const result = await this.repository.getUserListings(params);
    console.log('GetUserListingsUseCase result:', result);
    return result;
  }
}

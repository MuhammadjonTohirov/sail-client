import { IRecentlyViewedRepository } from '../../domain/repositories/IRecentlyViewedRepository';
import { RecentlyViewedListing } from '../../domain/models/RecentlyViewedListing';
import { RecentlyViewedDTO } from '../models/RecentlyViewedDTO';
import { RecentlyViewedMapper } from '../mappers/RecentlyViewedMapper';
import { apiFetch } from '../../lib/apiUtils';

export class RecentlyViewedRepositoryImpl implements IRecentlyViewedRepository {
  async getRecentlyViewed(): Promise<RecentlyViewedListing[]> {
    const data = await apiFetch('/api/v1/recently-viewed');
    const dtos: RecentlyViewedDTO[] = data || [];
    return RecentlyViewedMapper.toDomainList(dtos);
  }

  async trackListing(listingId: number): Promise<void> {
    await apiFetch(`/api/v1/recently-viewed/${listingId}`, { method: 'POST' });
  }

  async clearAll(): Promise<void> {
    await apiFetch('/api/v1/recently-viewed/clear', { method: 'DELETE' });
  }
}

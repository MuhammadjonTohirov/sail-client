import { useState, useCallback, useMemo } from 'react';
import { Listing } from '@/domain/models/Listing';
import { ListingPayload } from '@/domain/models/ListingPayload';
import { UserListingsParams } from '@/domain/models/UserListingsParams';
import { CreateListingUseCase } from '@/domain/usecases/listings/CreateListingUseCase';
import { GetListingDetailUseCase } from '@/domain/usecases/listings/GetListingDetailUseCase';
import { GetMyListingsUseCase } from '@/domain/usecases/listings/GetMyListingsUseCase';
import { GetUserListingsUseCase } from '@/domain/usecases/listings/GetUserListingsUseCase';
import { UpdateListingUseCase } from '@/domain/usecases/listings/UpdateListingUseCase';
import { RefreshListingUseCase } from '@/domain/usecases/listings/RefreshListingUseCase';
import { UploadListingMediaUseCase } from '@/domain/usecases/listings/UploadListingMediaUseCase';
import { DeleteListingMediaUseCase } from '@/domain/usecases/listings/DeleteListingMediaUseCase';
import { ListingsRepositoryImpl } from '@/data/repositories/ListingsRepositoryImpl';

export function useListings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repository = useMemo(() => new ListingsRepositoryImpl(), []);

  const createUseCase = useMemo(() => new CreateListingUseCase(repository), [repository]);
  const getDetailUseCase = useMemo(() => new GetListingDetailUseCase(repository), [repository]);
  const getMyListingsUseCase = useMemo(() => new GetMyListingsUseCase(repository), [repository]);
  const getUserListingsUseCase = useMemo(() => new GetUserListingsUseCase(repository), [repository]);
  const updateUseCase = useMemo(() => new UpdateListingUseCase(repository), [repository]);
  const refreshUseCase = useMemo(() => new RefreshListingUseCase(repository), [repository]);
  const uploadMediaUseCase = useMemo(() => new UploadListingMediaUseCase(repository), [repository]);
  const deleteMediaUseCase = useMemo(() => new DeleteListingMediaUseCase(repository), [repository]);

  const createListing = useCallback(async (payload: ListingPayload): Promise<Listing | null> => {
    try {
      setLoading(true);
      setError(null);
      return await createUseCase.execute(payload);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create listing';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createUseCase]);

  const getListingDetail = useCallback(async (id: number): Promise<Listing | null> => {
    try {
      setLoading(true);
      setError(null);
      return await getDetailUseCase.execute(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get listing detail';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getDetailUseCase]);

  const getMyListings = useCallback(async (): Promise<Listing[]> => {
    try {
      setLoading(true);
      setError(null);
      return await getMyListingsUseCase.execute();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get my listings';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [getMyListingsUseCase]);

  const getUserListings = useCallback(async (params: UserListingsParams): Promise<Listing[]> => {
    try {
      setLoading(true);
      setError(null);
      return await getUserListingsUseCase.execute(params);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get user listings';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [getUserListingsUseCase]);

  const updateListing = useCallback(async (id: number, payload: Partial<ListingPayload>): Promise<Listing | null> => {
    try {
      setLoading(true);
      setError(null);
      return await updateUseCase.execute(id, payload);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update listing';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateUseCase]);

  const refreshListing = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await refreshUseCase.execute(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh listing';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshUseCase]);

  const uploadMedia = useCallback(async (id: number, file: File): Promise<any> => {
    try {
      setLoading(true);
      setError(null);
      return await uploadMediaUseCase.execute(id, file);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload media';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [uploadMediaUseCase]);

  const deleteMedia = useCallback(async (listingId: number, mediaId: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await deleteMediaUseCase.execute(listingId, mediaId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete media';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [deleteMediaUseCase]);

  return {
    loading,
    error,
    createListing,
    getListingDetail,
    getMyListings,
    getUserListings,
    updateListing,
    refreshListing,
    uploadMedia,
    deleteMedia,
  };
}

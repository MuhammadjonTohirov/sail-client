import { IListingsRepository } from '../../repositories/IListingsRepository';

export class UploadListingMediaUseCase {
  constructor(private readonly repository: IListingsRepository) {}

  async execute(id: number, file: File): Promise<any> {
    if (!id || id <= 0) {
      throw new Error('Invalid listing ID');
    }
    if (!file) {
      throw new Error('File is required');
    }

    return await this.repository.uploadMedia(id, file);
  }
}

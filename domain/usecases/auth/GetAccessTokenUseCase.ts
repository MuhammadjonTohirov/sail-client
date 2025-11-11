import { IAuthRepository } from '../../repositories/IAuthRepository';

export class GetAccessTokenUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  execute(): string | null {
    return this.repository.getAccessToken();
  }
}

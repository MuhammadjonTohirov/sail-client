import { IAuthRepository } from '../../repositories/IAuthRepository';

export class LogoutUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  execute(): void {
    this.repository.clearAuth();
  }
}

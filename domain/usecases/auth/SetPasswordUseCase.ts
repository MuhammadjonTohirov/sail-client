import { IAuthRepository } from '../../repositories/IAuthRepository';

export class SetPasswordUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(newPassword: string): Promise<void> {
    if (!newPassword) throw new Error('New password is required');
    return this.repository.setPassword(newPassword);
  }
}

import { IAuthRepository } from '../../repositories/IAuthRepository';

export class ChangePasswordUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(currentPassword: string, newPassword: string): Promise<void> {
    if (!currentPassword || !newPassword) throw new Error('Both passwords are required');
    return this.repository.changePassword(currentPassword, newPassword);
  }
}

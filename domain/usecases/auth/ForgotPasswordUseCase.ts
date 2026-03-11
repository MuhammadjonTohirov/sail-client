import { IAuthRepository } from '../../repositories/IAuthRepository';

export class ForgotPasswordUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(login: string): Promise<void> {
    if (!login) throw new Error('Login is required');
    return this.repository.forgotPassword(login);
  }
}

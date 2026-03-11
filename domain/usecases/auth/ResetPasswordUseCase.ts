import { IAuthRepository } from '../../repositories/IAuthRepository';

export class ResetPasswordUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(login: string, code: string, password: string): Promise<void> {
    if (!login || !code || !password) throw new Error('Login, code, and password are required');
    return this.repository.resetPassword(login, code, password);
  }
}

import { IAuthRepository } from '../../repositories/IAuthRepository';
import { AuthResult } from '../../models/AuthToken';

export class LoginUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(login: string, password: string): Promise<AuthResult> {
    if (!login || !password) throw new Error('Login and password are required');
    return this.repository.login(login, password);
  }
}

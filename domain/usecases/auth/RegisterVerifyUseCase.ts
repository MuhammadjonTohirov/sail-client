import { IAuthRepository } from '../../repositories/IAuthRepository';
import { AuthResult } from '../../models/AuthToken';

export class RegisterVerifyUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(login: string, code: string, password: string, displayName?: string): Promise<AuthResult> {
    if (!login || !code || !password) throw new Error('Login, code, and password are required');
    return this.repository.registerVerify(login, code, password, displayName);
  }
}

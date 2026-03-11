import { IAuthRepository } from '../../repositories/IAuthRepository';
import { OtpRequestResult } from '../../models/AuthToken';

export class RegisterUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(login: string, password: string, displayName?: string): Promise<OtpRequestResult> {
    if (!login || !password) throw new Error('Login and password are required');
    return this.repository.register(login, password, displayName);
  }
}

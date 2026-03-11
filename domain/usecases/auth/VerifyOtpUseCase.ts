import { IAuthRepository } from '../../repositories/IAuthRepository';
import { AuthResult } from '../../models/AuthToken';

export class VerifyOtpUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(phone: string, code: string): Promise<AuthResult> {
    if (!phone || !code) throw new Error('Phone and code are required');
    return this.repository.verifyOtp(phone, code);
  }
}

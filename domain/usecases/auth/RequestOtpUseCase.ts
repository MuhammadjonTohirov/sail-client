import { IAuthRepository } from '../../repositories/IAuthRepository';
import { OtpRequestResult } from '../../models/AuthToken';

export class RequestOtpUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(phone: string): Promise<OtpRequestResult> {
    if (!phone) throw new Error('Phone number is required');
    return this.repository.requestOtp(phone);
  }
}

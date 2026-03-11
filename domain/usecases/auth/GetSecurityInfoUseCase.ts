import { IAuthRepository } from '../../repositories/IAuthRepository';
import { SecurityInfo } from '../../models/AuthToken';

export class GetSecurityInfoUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(): Promise<SecurityInfo> {
    return this.repository.getSecurityInfo();
  }
}

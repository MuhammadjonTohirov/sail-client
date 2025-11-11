import { IUsersRepository } from '@/domain/repositories/IUsersRepository';
import { User } from '@/domain/models/User';

export class GetUserByIdUseCase {
  constructor(private repository: IUsersRepository) {}

  async execute(userId: number): Promise<User> {
    return await this.repository.getUserById(userId);
  }
}

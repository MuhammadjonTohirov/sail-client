import { IUsersRepository } from '@/domain/repositories/IUsersRepository';
import { User } from '@/domain/models/User';
import { UserDTO } from '../models/UserDTO';
import { UserMapper } from '../mappers/UserMapper';
import { Users } from '@/lib/usersApi';

export class UsersRepositoryImpl implements IUsersRepository {
  async getUserById(userId: number): Promise<User> {
    const dto: UserDTO = await Users.getUserById(userId);
    return UserMapper.toDomain(dto);
  }
}

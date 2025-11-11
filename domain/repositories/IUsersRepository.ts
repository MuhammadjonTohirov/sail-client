import { User } from '../models/User';

export interface IUsersRepository {
  getUserById(userId: number): Promise<User>;
}

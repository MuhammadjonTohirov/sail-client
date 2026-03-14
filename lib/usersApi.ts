import { apiFetch } from './apiUtils';
import type { UserDTO } from '@/data/models/UserDTO';

export const Users = {
  getUserById: (userId: number): Promise<UserDTO> =>
    apiFetch(`/api/v1/users/${userId}`),
};

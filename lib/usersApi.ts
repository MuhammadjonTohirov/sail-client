import { apiFetch } from './apiUtils';

export const Users = {
  getUserById: (userId: number) =>
    apiFetch(`/api/v1/users/${userId}`),
};

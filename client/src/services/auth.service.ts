import { api } from '../common/axiosInstance';

/**
 * Authenticates a user and returns a JWT token.
 * @param data - Email and password credentials
 * @returns `{ access_token: string; user: AuthUser }`
 * @throws Normalized error on invalid credentials or request failure
 */
export const loginUser = async (data: { email: string; password: string }) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

/**
 * Registers a new user account.
 * @param data - Registration fields (name, email, password, phone, city)
 * @returns `{ access_token: string; user: AuthUser }`
 * @throws Normalized error with validation messages on 400/422
 */
export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  city?: string;
}) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

/**
 * Fetches the authenticated user's profile.
 * @returns `AuthUser` object for the current session
 * @throws Normalized error if not authenticated
 */
export const getMe = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

/**
 * Updates the authenticated user's profile fields.
 * @param data - Partial user fields to update (name, city, phone, avatar)
 * @returns Updated `AuthUser` object
 * @throws Normalized error on validation failure or unauthorized access
 */
export const updateMe = async (data: {
  name?: string;
  city?: string;
  phone?: string;
  avatar?: string;
}) => {
  const response = await api.patch('/users/me', data);
  return response.data;
};

import { PageResponse } from './page.types';

export type UserRole = 'ADMIN' | 'DEVELOPER' | 'EMPLOYEE';

export interface UserRequest {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
}

export type UserPageResponse = PageResponse<UserResponse>;

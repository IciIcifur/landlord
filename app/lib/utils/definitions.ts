export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
}

export enum UserRole {
  CLIENT,
  ADMIN,
}

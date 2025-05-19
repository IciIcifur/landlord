export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export enum UserRole {
  CLIENT,
  ADMIN,
}

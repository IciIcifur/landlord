import { action, makeAutoObservable, observable } from 'mobx';
import { User, UserRole } from '@/app/lib/utils/definitions';

class UserStore {
  user: User | undefined = undefined;
  isAuthenticated = false;

  constructor() {
    makeAutoObservable(this, {
      user: observable,
      isAuthenticated: observable,
      setUser: action,
      clearUser: action,
    });
  }

  setUser(email: string, password: string): void {
    // TODO: get id and role via getRequest
    this.user = { id: 'newUser', email, password, role: UserRole.ADMIN };
    this.isAuthenticated = true;
  }

  clearUser() {
    this.user = undefined;
    this.isAuthenticated = false;
  }
}

import { action, makeAutoObservable, observable } from 'mobx';
import { User } from '@/app/lib/utils/definitions';

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

  setUser(user: User): void {
    // TODO: get id and role via getRequest
    this.user = user;
    this.isAuthenticated = true;
  }

  clearUser() {
    this.user = undefined;
    this.isAuthenticated = false;
  }
}

const userStore = new UserStore();
export default userStore;

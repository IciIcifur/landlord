import { action, makeAutoObservable, observable } from 'mobx';
import { User, UserRole } from '@/app/lib/utils/definitions';

class UserStore {
  user: User | undefined = undefined;
  isAuthenticated = false;
  allUsers: User[] = [];

  constructor() {
    makeAutoObservable(this, {
      user: observable,
      isAuthenticated: observable,
      setUser: action,
      clearUser: action,
      allUsers: observable,
      setAllUsers: action,
      addUser: action,
      deleteUser: action,
    });
  }

  setUser(user: User): void {
    this.user = user;
    this.isAuthenticated = true;
  }
  clearUser() {
    this.user = undefined;
    this.isAuthenticated = false;
  }

  setAllUsers(users: User[]) {
    this.allUsers = users;
  }
  addUser(id: string, email: string) {
    this.allUsers.push({ id, email, role: UserRole.CLIENT });
  }
  deleteUser(id: string) {
    this.allUsers = this.allUsers.filter((user) => user.id !== id);
  }
}

const userStore = new UserStore();
export default userStore;

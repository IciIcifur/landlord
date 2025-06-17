import { action, makeAutoObservable, observable } from 'mobx';
import { RentalObject, User } from '@/app/lib/utils/definitions';

class ObjectsStore {
  allObjects: RentalObject[] = [];
  activeObject: RentalObject | null = null;

  constructor() {
    makeAutoObservable(this, {
      allObjects: observable,
      activeObject: observable,
      setAllObjects: action,
      setActiveObject: action,
      updateObjectById: action,
      deleteObjectById: action,
      deleteObjectUser: action,
      addObjectUser: action,
      getObjectById: observable,
    });
  }

  setAllObjects = (objects: any[]) => {
    // TODO: parse objects via zod
    this.allObjects = [...objects];
  };

  setActiveObject = (object: any) => {
    // TODO: parse object via zod
    this.activeObject = object;
  };

  getObjectById = (id: string): RentalObject => {
    const object = this.allObjects.find((object) => object.id == id);
    if (object) return object;
    throw new Error(`Объект ${id} не найден`);
  };
  updateObjectById = (objectId: string, newAttrs: Partial<RentalObject>) => {
    const objectIndex = this.allObjects.findIndex(
      (object) => object.id === objectId,
    );
    if (objectIndex >= 0) {
      this.allObjects[objectIndex] = {
        ...this.allObjects[objectIndex],
        ...newAttrs,
      };
    } else console.error(`Объект ${objectId} не существует.`);
  };
  deleteObjectUser = (objectId: string, userId: string) => {
    const objectIndex = this.allObjects.findIndex(
      (object) => object.id == objectId,
    );
    if (objectIndex >= 0) {
      const userIndex = this.allObjects[objectIndex].users.findIndex(
        (user) => user.id == userId,
      );
      if (userIndex >= 0)
        this.allObjects[objectIndex].users.splice(userIndex, 1);
    }
  };
  addObjectUser = (objectId: string, user: User) => {
    const objectIndex = this.allObjects.findIndex(
      (object) => object.id == objectId,
    );
    if (objectIndex >= 0) {
      this.allObjects[objectIndex].users = [
        ...this.allObjects[objectIndex].users,
        user,
      ];
    }
  };
  deleteObjectById = (objectId: string) => {
    this.allObjects = this.allObjects.filter(
      (object) => object.id !== objectId,
    );
  };
}

const objectsStore = new ObjectsStore();
export default objectsStore;

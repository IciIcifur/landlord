import { action, makeAutoObservable, observable } from 'mobx';
import { RentalObject } from '@/app/lib/utils/definitions';

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
    return this.allObjects.find((object) => object.id == id);
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
    } else console.error('Этого объекта не существует.');
  };

  deleteObjectById = (objectId: string) => {
    this.allObjects = this.allObjects.filter(
      (object) => object.id !== objectId,
    );
  };
}

const objectsStore = new ObjectsStore();
export default objectsStore;

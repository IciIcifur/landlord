import { action, makeAutoObservable, observable } from 'mobx';

class ObjectsStore {
  allObjects: any[] = [];
  activeObject: any = null;

  constructor() {
    makeAutoObservable(this, {
      allObjects: observable,
      activeObject: observable,
      setAllObjects: action,
      setActiveObject: action,
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

  updateObjectById = (objectId: string, newAttrs: any) => {
    const objectIndex = this.allObjects.findIndex(
      (object) => object.id === objectId,
    );
    if (objectIndex >= 0) {
      this.allObjects[objectIndex] = {
        ...this.allObjects[objectIndex],
        ...newAttrs,
      };
      // TODO: post request
    } else console.error('Этого объекта не существует.');
  };
}

const objectsStore = new ObjectsStore();
export default objectsStore;

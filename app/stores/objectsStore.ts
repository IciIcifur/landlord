import { action, computed, makeAutoObservable, observable } from 'mobx';
import {
  DataForSale,
  ObjectRecord,
  RentalObject,
  User,
} from '@/app/lib/utils/definitions';

class ObjectsStore {
  allObjects: RentalObject[] = [];
  activeObject: RentalObject | null = null;

  constructor() {
    makeAutoObservable(this, {
      allObjects: observable,
      activeObject: observable,
      setAllObjects: action,
      setActiveObject: action,
      activeObjectDataForSale: computed,
      updateActiveObjectDataForSale: action,
      addActiveObjectRecord: action,
      addObject: action,
      updateObjectById: action,
      deleteObjectById: action,
      deleteObjectUser: action,
      addObjectUser: action,
      getObjectById: observable,
    });
  }

  setAllObjects = (objects: any[]) => {
    this.allObjects = [...objects];
  };

  setActiveObject = (object: any) => {
    this.activeObject = object;
  };
  updateActiveObjectDataForSale = (newAttrs: Partial<DataForSale>) => {
    if (!this.activeObject) return;
    this.activeObject.dataForSale = {
      ...this.activeObject.dataForSale,
      ...newAttrs,
    } as DataForSale;
  };
  addActiveObjectRecord = (newRecord: ObjectRecord) => {
    if (!this.activeObject) return;
    if (!this.activeObject.records) this.activeObject.records = [];
    this.activeObject.records = [...this.activeObject.records, newRecord];
  };
  get activeObjectDataForSale() {
    if (!this.activeObject?.dataForSale) return;
    if (!this.activeObject.records)
      return {
        purchasePrice: this.activeObject.dataForSale.purchasePrice,
        priceForSale: this.activeObject.dataForSale.priceForSale,
        countOfMonth: 0,
        profitPerMonth: 0,
        totalProfit: 0,
        payback5Year: 0,
        payback7Year: 0,
        payback10Year: 0,
        percentPerYear: 0,
      };

    function mean(array: number[] = []): number {
      let m = 0;
      for (let i of array) m += i;
      return (m / array.length) | 0;
    }

    function last12Months(array: ObjectRecord[]): ObjectRecord[] {
      const now = new Date();
      const lastYear = new Date(
        now.getFullYear(),
        now.getMonth() - 11,
        now.getDay(),
      );
      return array.filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate >= lastYear && recordDate;
      });
    }

    const totalProfitPerYear = mean(
      last12Months(this.activeObject.records).map(
        (record) => record.totalProfit | 0,
      ),
    );
    const dataForSale: DataForSale = {
      purchasePrice: this.activeObject.dataForSale.purchasePrice,
      priceForSale: this.activeObject.dataForSale.priceForSale,
      countOfMonth: this.activeObject.records.length,
      profitPerMonth: mean(
        this.activeObject.records.map((record) => record.totalProfit | 0),
      ),
      totalProfit: totalProfitPerYear,
      payback5Year: totalProfitPerYear * 5,
      payback7Year: totalProfitPerYear * 7,
      payback10Year: totalProfitPerYear * 10,
      percentPerYear:
        ((totalProfitPerYear * 100) /
          this.activeObject.dataForSale.priceForSale) *
        0.94 *
        12,
    };
    return dataForSale;
  }

  getObjectById = (id: string): RentalObject => {
    const object = this.allObjects.find((object) => object.id == id);
    if (object) return object;
    throw new Error(`Объект ${id} не найден`);
  };
  addObject = (newObject: RentalObject) => {
    this.allObjects.push(newObject);
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

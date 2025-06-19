import ObjectModel from '@/app/models/ObjectModel';
import UserModel, { UserRole } from '@/app/models/UserModel';
import { createDataForSale, getDataForSaleByObjectId } from './data-for-sale-service';
import { getRecordsByObjectId } from './record-service';
import connectDB from '@/app/lib/utils/db';
import { transformMongooseDoc } from '@/app/lib/utils/transformMongooseDoc';
import RecordModel from '@/app/models/RecordModel';
import DataForSaleModel from '@/app/models/DataForSaleModel';

export interface CreateObjectData {
  name: string;
  address: string;
  square: number;
}

export interface UpdateObjectData {
  name?: string;
  address?: string;
  square?: number;
  description?: string;
}

export interface ObjectWithDetails {
  id: string;
  name: string;
  address: string;
  square: number;
  description?: string;
  users?: Array<{ id: string; email: string }>;
  records?: any[];
  dataForSale?: any;
}

export class ObjectServiceError extends Error {
  public errors?: Record<string, string>;

  constructor(
    message: string,
    public statusCode = 400,
    validationErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = 'ObjectServiceError';
    this.errors = validationErrors;
  }
}

export async function getAllObjects(userId: string, userRole: string) {
  await connectDB();
  try {
    let objects;
    if (userRole === UserRole.ADMIN) {
      objects = await ObjectModel.find({}).select('id name address square description users').lean();
    } else {
      objects = await ObjectModel.find({ users: userId }).select('id name address square description').lean();
    }
    objects = transformMongooseDoc(objects);
    if (userRole === UserRole.ADMIN) {
      const userIdsSet = new Set<string>();
      objects.forEach((obj: any) => {
        if (obj.users && Array.isArray(obj.users)) {
          obj.users.forEach((uid: string) => userIdsSet.add(uid));
        }
      });
      const userIds = Array.from(userIdsSet);
      const usersById: Record<string, { id: string; email: string }> = {};
      if (userIds.length > 0) {
        const users = await UserModel.find({ _id: { $in: userIds } })
          .select('id email')
          .lean()
          .exec();
        const transformedUsers = transformMongooseDoc(users);
        transformedUsers.forEach((u: any) => {
          usersById[u.id] = { id: u.id, email: u.email };
        });
      }
      objects = objects.map((obj: any) => ({
        ...obj,
        users: (obj.users || []).map((uid: string) => usersById[uid]).filter(Boolean),
      }));
    }
    return objects;
  } catch (error: any) {
    throw new ObjectServiceError(error.message || 'Ошибка на сервере', 500);
  }
}

export async function createObject(objectData: CreateObjectData): Promise<{ id: string }> {
  await connectDB();
  const { name, address, square } = objectData;
  const validationErrors: Record<string, string> = {};
  if (!name) validationErrors.name = 'Название обязательно';
  if (!address) validationErrors.address = 'Адрес обязателен';
  if (isNaN(square)) validationErrors.square = 'Площадь обязательна';
  if (square < 0) validationErrors.square = 'Площадь не может быть отрицательной';
  if (Object.keys(validationErrors).length) {
    throw new ObjectServiceError('Ошибки валидации', 400, validationErrors);
  }
  try {
    const newObj = new ObjectModel({
      name,
      address,
      square,
      users: [],
    });
    await newObj.save();
    const { id: dataForSaleId } = await createDataForSale(newObj.id);
    await ObjectModel.findByIdAndUpdate(newObj.id, {
      dataForSale: dataForSaleId,
    });
    return { id: newObj.id };
  } catch (error: any) {
    throw new ObjectServiceError(error.message || 'Ошибка на сервере', 500);
  }
}

export async function getObjectById(objectId: string, userId: string, userRole: string): Promise<ObjectWithDetails> {
  await connectDB();
  try {
    const obj: any = await ObjectModel.findById(objectId).select('id name address square description users').lean();
    if (!obj) {
      throw new ObjectServiceError('Объект не найден', 404);
    }
    const transformedObj = transformMongooseDoc(obj);
    if (userRole !== UserRole.ADMIN && !(transformedObj.users || []).includes(userId)) {
      throw new ObjectServiceError('Ошибка доступа', 403);
    }
    transformedObj.records = await getRecordsByObjectId(objectId);
    if (userRole === UserRole.ADMIN) {
      try {
        transformedObj.dataForSale = await getDataForSaleByObjectId(objectId);
      } catch (error) {
        const { id: dataForSaleId } = await createDataForSale(objectId);
        await ObjectModel.findByIdAndUpdate(objectId, { dataForSale: dataForSaleId });
        transformedObj.dataForSale = await getDataForSaleByObjectId(objectId);
      }
      if (transformedObj.users && transformedObj.users.length) {
        const users = await UserModel.find({ _id: { $in: transformedObj.users } })
          .select('id email')
          .lean()
          .exec();
        transformedObj.users = transformMongooseDoc(users).map((u: any) => ({ id: u.id, email: u.email }));
      }
    } else {
      delete transformedObj.users;
    }
    return transformedObj;
  } catch (error: any) {
    if (error instanceof ObjectServiceError) {
      throw error;
    }
    throw new ObjectServiceError(error.message || 'Ошибка на сервере', 500);
  }
}

export async function updateObject(objectId: string, updateData: UpdateObjectData): Promise<{ message: string }> {
  await connectDB();
  const allowedFields = ['name', 'address', 'square', 'description'];
  const changes: any = {};
  for (const field of allowedFields) {
    if (updateData[field as keyof UpdateObjectData] !== undefined) {
      changes[field] = updateData[field as keyof UpdateObjectData];
    }
  }
  try {
    const obj: any = await ObjectModel.findById(objectId).lean();
    if (!obj) {
      throw new ObjectServiceError('Объект не найден', 404);
    }
    await ObjectModel.findByIdAndUpdate(objectId, changes);
    return { message: 'Объект обновлен' };
  } catch (error: any) {
    if (error instanceof ObjectServiceError) {
      throw error;
    }
    throw new ObjectServiceError(error.message || 'Ошибка на сервере', 500);
  }
}

export async function deleteObject(objectId: string): Promise<{ message: string }> {
  await connectDB();
  try {
    const obj = await ObjectModel.findById(objectId);
    if (!obj) {
      throw new ObjectServiceError('Объект не найден', 404);
    }
    await RecordModel.deleteMany({ objectId });
    await DataForSaleModel.deleteMany({ objectId });
    await ObjectModel.findByIdAndDelete(objectId);
    return { message: 'Объект и все связанные данные удалены' };
  } catch (error: any) {
    if (error instanceof ObjectServiceError) {
      throw error;
    }
    throw new ObjectServiceError(error.message || 'Ошибка на сервере', 500);
  }
}

export async function addUserToObject(objectId: string, userId: string): Promise<{ message: string }> {
  await connectDB();
  if (!userId) {
    throw new ObjectServiceError('id пользователя обязателен', 400);
  }
  try {
    const user = await UserModel.findById(userId).select('id');
    if (!user) {
      throw new ObjectServiceError('Пользователь не найден', 404);
    }
    const obj = await ObjectModel.findByIdAndUpdate(objectId, { $addToSet: { users: userId } }, { new: true })
      .lean()
      .exec();
    if (!obj) {
      throw new ObjectServiceError('Объект не найден', 404);
    }
    return { message: 'Пользователь добавлен' };
  } catch (error: any) {
    if (error instanceof ObjectServiceError) {
      throw error;
    }
    throw new ObjectServiceError(error.message || 'Ошибка на сервере', 500);
  }
}

export async function removeUserFromObject(objectId: string, userId: string): Promise<{ message: string }> {
  await connectDB();
  try {
    const obj = await ObjectModel.findByIdAndUpdate(objectId, { $pull: { users: userId } }, { new: true })
      .lean()
      .exec();
    if (!obj) {
      throw new ObjectServiceError('Объект не найден', 404);
    }
    return { message: 'Пользователь удален' };
  } catch (error: any) {
    throw new ObjectServiceError(error.message || 'Ошибка на сервере', 500);
  }
}

export async function checkUserAccessToObject(objectId: string, userId: string, userRole: string): Promise<boolean> {
  await connectDB();
  try {
    if (userRole === UserRole.ADMIN) {
      return true;
    }
    const obj = await ObjectModel.findById(objectId).select('users').lean();
    if (!obj) {
      return false;
    }
    const objData = obj as any;
    return (objData.users || []).includes(userId);
  } catch (error) {
    return false;
  }
}

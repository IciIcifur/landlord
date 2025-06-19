import RecordModel from '@/app/models/RecordModel';
import ObjectModel from '@/app/models/ObjectModel';
import { recalculateDataForSale } from './data-for-sale-service';
import { checkUserAccessToObject } from './object-service';
import connectDB from '@/app/lib/utils/db';
import { transformMongooseDoc } from '@/app/lib/utils/transformMongooseDoc';

export interface CreateRecordData {
  objectId: string;
  rent?: number;
  heat?: number;
  exploitation?: number;
  mop?: number;
  renovation?: number;
  tbo?: number;
  electricity?: number;
  earthRent?: number;
  otherExpenses?: number;
  otherIncomes?: number;
  security?: number;
}

export class RecordServiceError extends Error {
  public errors?: Record<string, string>;

  constructor(
    message: string,
    public statusCode = 400,
    validationErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = 'RecordServiceError';
    this.errors = validationErrors;
  }
}

export async function createRecord(
  recordData: CreateRecordData,
  userId: string,
  userRole: string,
): Promise<{ id: string }> {
  await connectDB();
  const { objectId, ...otherFields } = recordData;
  const validationErrors: Record<string, string> = {};
  if (!objectId) validationErrors.objectId = 'ID объекта обязателен';
  if (Object.keys(validationErrors).length) {
    throw new RecordServiceError('Ошибки валидации', 400, validationErrors);
  }
  try {
    const hasAccess = await checkUserAccessToObject(objectId, userId, userRole);
    if (!hasAccess) {
      throw new RecordServiceError('Ошибка доступа к объекту', 403);
    }
    const objectExists = await ObjectModel.findById(objectId);
    if (!objectExists) {
      throw new RecordServiceError('Объект не найден', 404);
    }
    const currentDate = new Date().toISOString();
    const newRecord = new RecordModel({
      objectId,
      date: currentDate,
      ...otherFields,
    });
    await newRecord.save();
    await ObjectModel.findByIdAndUpdate(objectId, {
      $addToSet: { records: newRecord.id },
    });
    await recalculateDataForSale(objectId);
    return { id: newRecord.id };
  } catch (error: any) {
    if (error instanceof RecordServiceError) {
      throw error;
    }
    throw new RecordServiceError(error.message || 'Ошибка на сервере', 500);
  }
}

export async function getRecordsByObjectId(objectId: string) {
  await connectDB();
  try {
    const records = await RecordModel.find({ objectId })
      .sort({ date: -1 })
      .lean();
    return transformMongooseDoc(records);
  } catch (error: any) {
    throw new RecordServiceError(error.message || 'Ошибка на сервере', 500);
  }
}

export async function getRecordById(recordId: string) {
  await connectDB();
  try {
    const record = await RecordModel.findById(recordId).lean();
    if (!record) {
      throw new RecordServiceError('Запись не найдена', 404);
    }
    return transformMongooseDoc(record);
  } catch (error: any) {
    if (error instanceof RecordServiceError) {
      throw error;
    }
    throw new RecordServiceError(error.message || 'Ошибка на сервере', 500);
  }
}

export async function deleteRecord(
  recordId: string,
): Promise<{ message: string }> {
  await connectDB();
  try {
    const record = await RecordModel.findById(recordId).exec();
    if (!record) {
      throw new RecordServiceError('Запись не найдена', 404);
    }
    const objectId = record.objectId;
    await ObjectModel.findByIdAndUpdate(objectId, {
      $pull: { records: recordId },
    });
    await RecordModel.findByIdAndDelete(recordId);
    await recalculateDataForSale(objectId);
    return { message: 'Запись удалена' };
  } catch (error: any) {
    throw new RecordServiceError(error.message || 'Ошибка на сервере', 500);
  }
}

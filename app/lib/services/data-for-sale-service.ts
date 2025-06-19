import DataForSaleModel from '@/app/models/DataForSaleModel';
import RecordModel from '@/app/models/RecordModel';
import connectDB from '@/app/lib/utils/db';
import { transformMongooseDoc } from '@/app/lib/utils/transformMongooseDoc';

export interface UpdateDataForSaleData {
  purchasePrice?: number;
  priceForSale?: number;
}

export class DataForSaleServiceError extends Error {
  public errors?: Record<string, string>;

  constructor(
    message: string,
    public statusCode = 400,
    validationErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = 'DataForSaleServiceError';
    this.errors = validationErrors;
  }
}

function getLast12MonthsRecords(records: any[]): any[] {
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 12, 1);
  return records.filter((record) => {
    const recordDate = new Date(record.date);
    return recordDate >= twelveMonthsAgo;
  });
}

async function calculateDataForSaleMetrics(
  objectId: string,
  purchasePrice: number,
  priceForSale: number,
) {
  const records = await RecordModel.find({ objectId }).lean().exec();
  const transformedRecords = transformMongooseDoc(records);
  if (transformedRecords.length === 0) {
    return {
      countOfMonth: 0,
      profitPerMonth: 0,
      totalProfit: 0,
      payback5Year: 0,
      payback7Year: 0,
      payback10Year: 0,
      percentPerYear: 0,
    };
  }
  const recordsWithProfit = transformedRecords
    .map((record: any) => ({
      ...record,
      totalExpenses:
        record.heat +
        record.exploitation +
        record.mop +
        record.renovation +
        record.tbo +
        record.electricity +
        record.earthRent +
        record.otherExpenses +
        record.security,
      totalIncomes: record.rent + record.otherIncomes,
    }))
    .map((record: any) => ({
      ...record,
      totalProfit: record.totalIncomes - record.totalExpenses,
    }));

  const countOfMonth = recordsWithProfit.length;
  const profitPerMonth =
    recordsWithProfit.reduce(
      (sum: number, record: any) => sum + record.totalProfit,
      0,
    ) / countOfMonth;
  const last12MonthsRecords = getLast12MonthsRecords(recordsWithProfit);
  const totalProfitPerYear = last12MonthsRecords.reduce(
    (sum: number, record: any) => sum + record.totalProfit,
    0,
  );
  const payback5Year = totalProfitPerYear * 5;
  const payback7Year = totalProfitPerYear * 7;
  const payback10Year = totalProfitPerYear * 10;
  const averageProfitLast12Months =
    last12MonthsRecords.length > 0
      ? last12MonthsRecords.reduce(
          (sum: number, record: any) => sum + record.totalProfit,
          0,
        ) / last12MonthsRecords.length
      : 0;
  const percentPerYear =
    priceForSale > 0
      ? ((averageProfitLast12Months * 100) / (priceForSale * 0.94)) * 12
      : 0;
  return {
    countOfMonth,
    profitPerMonth,
    totalProfit: totalProfitPerYear,
    payback5Year,
    payback7Year,
    payback10Year,
    percentPerYear,
  };
}

export async function createDataForSale(
  objectId: string,
): Promise<{ id: string }> {
  await connectDB();
  try {
    const dataForSale = new DataForSaleModel({
      objectId,
      purchasePrice: 0,
      priceForSale: 0,
      countOfMonth: 0,
      profitPerMonth: 0,
      totalProfit: 0,
      payback5Year: 0,
      payback7Year: 0,
      payback10Year: 0,
      percentPerYear: 0,
    });
    await dataForSale.save();
    return { id: dataForSale.id };
  } catch (error: any) {
    throw new DataForSaleServiceError(
      error.message || 'Ошибка на сервере',
      500,
    );
  }
}

export async function updateDataForSale(
  objectId: string,
  updateData: UpdateDataForSaleData,
): Promise<{ message: string }> {
  await connectDB();
  try {
    const dataForSale = await DataForSaleModel.findOne({ objectId }).exec();
    if (!dataForSale) {
      throw new DataForSaleServiceError('Данные продажи не найдены', 404);
    }
    if (updateData.purchasePrice !== undefined) {
      dataForSale.purchasePrice = updateData.purchasePrice;
    }
    if (updateData.priceForSale !== undefined) {
      dataForSale.priceForSale = updateData.priceForSale;
    }
    const metrics = await calculateDataForSaleMetrics(
      objectId,
      dataForSale.purchasePrice,
      dataForSale.priceForSale,
    );
    Object.assign(dataForSale, metrics);
    await dataForSale.save();
    return { message: 'Данные продажи обновлены' };
  } catch (error: any) {
    if (error instanceof DataForSaleServiceError) {
      throw error;
    }
    throw new DataForSaleServiceError(
      error.message || 'Ошибка на сервере',
      500,
    );
  }
}

export async function recalculateDataForSale(
  objectId: string,
): Promise<{ message: string }> {
  await connectDB();
  try {
    const dataForSale = await DataForSaleModel.findOne({ objectId }).exec();
    if (!dataForSale) {
      throw new DataForSaleServiceError('Данные продажи не найдены', 404);
    }
    const metrics = await calculateDataForSaleMetrics(
      objectId,
      dataForSale.purchasePrice,
      dataForSale.priceForSale,
    );
    Object.assign(dataForSale, metrics);
    await dataForSale.save();
    return { message: 'Данные продажи пересчитаны' };
  } catch (error: any) {
    if (error instanceof DataForSaleServiceError) {
      throw error;
    }
    throw new DataForSaleServiceError(
      error.message || 'Ошибка на сервере',
      500,
    );
  }
}

export async function getDataForSaleByObjectId(objectId: string) {
  await connectDB();
  try {
    const dataForSale = await DataForSaleModel.findOne({ objectId }).lean();
    if (!dataForSale) {
      throw new DataForSaleServiceError('Данные продажи не найдены', 404);
    }
    return transformMongooseDoc(dataForSale);
  } catch (error: any) {
    if (error instanceof DataForSaleServiceError) {
      throw error;
    }
    throw new DataForSaleServiceError(
      error.message || 'Ошибка на сервере',
      500,
    );
  }
}

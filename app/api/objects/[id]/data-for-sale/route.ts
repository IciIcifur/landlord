import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/app/lib/utils/auth';
import {
    DataForSaleServiceError,
    getDataForSaleByObjectId,
    updateDataForSale,
} from '@/app/lib/services/data-for-sale-service';
import { errorResponse, successResponse } from '@/app/lib/utils/response';

export async function GET(req: NextRequest, context: any) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;
  const params = await context.params;
  const objectId = params.id;
  try {
    const dataForSale = await getDataForSaleByObjectId(objectId);
    return successResponse(dataForSale);
  } catch (error: any) {
    if (error instanceof DataForSaleServiceError) {
      return errorResponse(error.message, error.statusCode);
    }
    return errorResponse('Ошибка на сервере', 500);
  }
}

export async function PATCH(req: NextRequest, context: any) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;
  const params = await context.params;
  const objectId = params.id;
  try {
    const updateData = await req.json();
    const result = await updateDataForSale(objectId, updateData);
    return successResponse(result);
  } catch (error: any) {
    if (error instanceof DataForSaleServiceError) {
      return errorResponse(error.message, error.statusCode);
    }
    return errorResponse('Ошибка на сервере', 500);
  }
}

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/app/lib/utils/auth';
import {
  deleteRecord,
  getRecordById,
  RecordServiceError,
} from '@/app/lib/services/record-service';
import { errorResponse, successResponse } from '@/app/lib/utils/response';

export async function GET(req: NextRequest, context: any) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;
  const params = await context.params;
  const recordId = params.id;
  try {
    const record = await getRecordById(recordId);
    return successResponse(record);
  } catch (error: any) {
    if (error instanceof RecordServiceError) {
      return errorResponse(error.message, error.statusCode);
    }
    return errorResponse('Ошибка на сервере', 500);
  }
}

export async function DELETE(req: NextRequest, context: any) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;
  const params = await context.params;
  const recordId = params.id;
  try {
    const result = await deleteRecord(recordId);
    return successResponse(result);
  } catch (error: any) {
    if (error instanceof RecordServiceError) {
      return errorResponse(error.message, error.statusCode);
    }
    return errorResponse('Ошибка на сервере', 500);
  }
}

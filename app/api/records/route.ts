import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requireUser } from '@/app/lib/utils/auth';
import {
  createRecord,
  RecordServiceError,
} from '@/app/lib/services/record-service';
import { errorResponse, successResponse } from '@/app/lib/utils/response';

export async function POST(req: NextRequest) {
  const user = await requireUser(req);
  if (user instanceof NextResponse) {
    return user;
  }
  const { id: userId, role } = user as {
    id: string;
    email: string;
    role: string;
  };
  try {
    const recordData = await req.json();
    const result = await createRecord(recordData, userId, role);
    return successResponse(result, 201);
  } catch (error: any) {
    if (error instanceof RecordServiceError) {
      if (error.errors) {
        return errorResponse(error.errors, error.statusCode);
      }
      return errorResponse(error.message, error.statusCode);
    }
    return errorResponse('Ошибка на сервере', 500);
  }
}

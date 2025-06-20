import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/app/lib/utils/auth';
import {
  deleteUser,
  getUserById,
  UserServiceError,
} from '@/app/lib/services/user-service';
import { errorResponse, successResponse } from '@/app/lib/utils/response';

export async function GET(req: NextRequest, context: any) {
  const params = await context.params;
  const userId = params.id;

  try {
    const user = await getUserById(userId);
    return successResponse(user);
  } catch (error: any) {
    if (error instanceof UserServiceError) {
      return errorResponse(error.message, error.statusCode);
    }
    return errorResponse('Ошибка на сервере', 500);
  }
}

export async function DELETE(req: NextRequest, context: any) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) {
    return admin;
  }
  try {
    const params = await context.params;
    const targetUserId = params.id;
    const result = await deleteUser(targetUserId);
    return successResponse(result);
  } catch (error: any) {
    if (error instanceof UserServiceError) {
      if (error.errors) {
        return errorResponse(error.errors, error.statusCode);
      }
      return errorResponse(error.message, error.statusCode);
    }
    return errorResponse('Ошибка на сервере', 500);
  }
}

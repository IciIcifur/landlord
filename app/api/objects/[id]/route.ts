import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requireAdmin, requireUser } from '@/app/lib/utils/auth';
import {
  deleteObject,
  getObjectById,
  ObjectServiceError,
  updateObject,
} from '@/app/lib/services/object-service';
import { errorResponse, successResponse } from '@/app/lib/utils/response';

export async function GET(req: NextRequest, context: any) {
  const user = await requireUser(req);
  if (user instanceof NextResponse) return user;
  const { id: userId, role } = user as {
    id: string;
    email: string;
    role: string;
  };
  const params = await context.params;
  const objectId = params.id;
  try {
    const obj = await getObjectById(objectId, userId, role);
    return successResponse(obj);
  } catch (error: any) {
    if (error instanceof ObjectServiceError) {
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
    const result = await updateObject(objectId, updateData);
    return successResponse(result);
  } catch (error: any) {
    if (error instanceof ObjectServiceError) {
      return errorResponse(error.message, error.statusCode);
    }
    return errorResponse('Ошибка на сервере', 500);
  }
}

export async function DELETE(req: NextRequest, context: any) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;
  const params = await context.params;
  const objectId = params.id;
  try {
    const result = await deleteObject(objectId);
    return successResponse(result);
  } catch (error: any) {
    if (error instanceof ObjectServiceError) {
      return errorResponse(error.message, error.statusCode);
    }
    return errorResponse('Ошибка на сервере', 500);
  }
}

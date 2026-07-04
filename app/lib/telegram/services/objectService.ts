import type { RentalObject, ObjectRecord } from '@/app/lib/utils/definitions';
import {
  getAllObjects,
  getObjectById as getObjectById_,
  ObjectServiceError,
  ObjectWithDetails,
} from '@/app/lib/services/object-service';
import { getRecordsByObjectId as getRecordsByObjectId_ } from '@/app/lib/services/record-service';

export interface ObjectResponse {
  success: boolean;
  object?: RentalObject;
  error?: {
    message: string;
    statusCode?: number;
    validationErrors?: Record<string, string>;
  };
}

export interface ObjectWithDetailsResponse {
  success: boolean;
  object?: ObjectWithDetails;
  error?: {
    message: string;
    statusCode?: number;
    validationErrors?: Record<string, string>;
  };
}

export class ObjectService {
  async getUserObjects(
    userId: string,
    userRole: string,
  ): Promise<RentalObject[]> {
    try {
      return await getAllObjects(userId, userRole);
    } catch (error) {
      console.error('Get user objects error:', error);
      return [];
    }
  }

  async getObjectById(
    objectId: string,
    userId: string,
    userRole: string,
  ): Promise<ObjectWithDetailsResponse> {
    try {
      const object = await getObjectById_(objectId, userId, userRole);
      return {
        success: true,
        object,
      };
    } catch (error) {
      console.error('Get object error:', error);
      if (error instanceof ObjectServiceError) {
        return {
          success: false,
          error: {
            message: error.message,
            statusCode: error.statusCode,
            validationErrors: error.errors,
          },
        };
      }

      return {
        success: false,
        error: {
          message: 'Произошла внутренняя ошибка. Пожалуйста, попробуйте позже.',
          statusCode: 500,
        },
      };
    }
  }

  async getRecordsByObjectId(
    objectId: string,
  ): Promise<ObjectRecord[]> {
    try {
      return await getRecordsByObjectId_(objectId);
    } catch (error) {
      console.error('Get records by object ID error:', error);
      return [];
    }
  }
}

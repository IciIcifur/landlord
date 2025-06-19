import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";
import {requireAdmin} from "@/app/lib/utils/auth";
import {ObjectServiceError, removeUserFromObject} from "@/app/lib/services/object-service";
import {errorResponse, successResponse} from "@/app/lib/utils/response";

export async function DELETE(req: NextRequest, context: any) {
    const adminOrError = await requireAdmin(req);
    if (adminOrError instanceof NextResponse) return adminOrError;
    const params = await context.params;
    const objectId = params.id;
    const userId = params.userId;

    try {
        const result = await removeUserFromObject(objectId, userId);
        return successResponse(result);
    } catch (error: any) {
        if (error instanceof ObjectServiceError) {
            return errorResponse(error.message, error.statusCode);
        }
        return errorResponse("Ошибка на сервере", 500);
    }
}
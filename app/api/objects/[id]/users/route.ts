import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";
import {requireAdmin} from "@/app/lib/utils/auth";
import {addUserToObject, ObjectServiceError} from "@/app/lib/services/object-service";
import {errorResponse, successResponse} from "@/app/lib/utils/response";

export async function POST(req: NextRequest, context: any) {
    const admin = await requireAdmin(req);
    if (admin instanceof NextResponse) return admin;
    const params = await context.params;
    const objectId = params.id;

    try {
        const {userId} = await req.json();
        const result = await addUserToObject(objectId, userId);
        return successResponse(result);
    } catch (error: any) {
        if (error instanceof ObjectServiceError) {
            return errorResponse(error.message, error.statusCode);
        }
        return errorResponse("Ошибка на сервере", 500);
    }
}
import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";
import {requireAdmin, requireUser} from "@/app/lib/utils/auth";
import {createObject, getAllObjects, ObjectServiceError} from "@/app/lib/services/object-service";
import {errorResponse, successResponse} from "@/app/lib/utils/response";

export async function GET(req: NextRequest) {
    const user = await requireUser(req);
    if (user instanceof NextResponse) {
        return user;
    }
    const {id: userId, role} = user as { id: string; email: string; role: string };
    try {
        const objects = await getAllObjects(userId, role);
        return successResponse(objects);
    } catch (error: any) {
        if (error instanceof ObjectServiceError) {
            return errorResponse(error.message, error.statusCode);
        }
        return errorResponse("Ошибка на сервере", 500);
    }
}

export async function POST(req: NextRequest) {
    const admin = await requireAdmin(req);
    if (admin instanceof NextResponse) {
        return admin;
    }
    try {
        const objectData = await req.json();
        const result = await createObject(objectData);
        return successResponse(result, 201);
    } catch (error: any) {
        if (error instanceof ObjectServiceError) {
            if (error.errors) {
                return errorResponse(error.errors, error.statusCode);
            }
            return errorResponse(error.message, error.statusCode);
        }
        return errorResponse("Ошибка на сервере", 500);
    }
}
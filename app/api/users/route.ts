import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";
import {requireAdmin} from "@/app/lib/utils/auth";
import {createOrUpdateUser, getAllUsers, UserServiceError} from "@/app/lib/services/user-service";
import {errorResponse, successResponse} from "@/app/lib/utils/response";

export async function GET(req: NextRequest) {
    const admin = await requireAdmin(req);
    if (admin instanceof NextResponse) {
        return admin;
    }

    try {
        const users = await getAllUsers();
        return successResponse(users);
    } catch (error: any) {
        if (error instanceof UserServiceError) {
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
        const userData = await req.json();
        const result = await createOrUpdateUser(userData);
        const statusCode = result.message === "Пользователь создан" ? 201 : 200;
        return successResponse(result, statusCode);
    } catch (error: any) {
        if (error instanceof UserServiceError) {
            if (error.errors) {
                return errorResponse(error.errors, error.statusCode);
            }
            return errorResponse(error.message, error.statusCode);
        }
        return errorResponse("Ошибка на сервере", 500);
    }
}
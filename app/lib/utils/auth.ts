import type {NextRequest} from "next/server";
import {errorResponse} from "@/app/lib/utils/response";
import {requireAdminAccess, requireUserAccess} from "../services/auth-service";

export async function requireUser(req: NextRequest) {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
        return errorResponse("ID пользователя обязателен", 401);
    }
    try {
        return await requireUserAccess(userId);
    } catch (error: any) {
        return errorResponse(error.message, error.statusCode || 401);
    }
}

export async function requireAdmin(req: NextRequest) {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
        return errorResponse("ID пользователя обязателен", 401);
    }
    try {
        return await requireAdminAccess(userId);
    } catch (error: any) {
        return errorResponse(error.message, error.statusCode || 401);
    }
}
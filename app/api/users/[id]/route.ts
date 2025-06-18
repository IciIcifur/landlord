import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";
import {requireAdmin} from "@/app/lib/utils/auth";
import {deleteUser, UserServiceError} from "@/app/lib/services/user-service";
import {errorResponse, successResponse} from "@/app/lib/utils/response";

export async function DELETE(req: NextRequest) {
    const admin = await requireAdmin(req);
    if (admin instanceof NextResponse) {
        return admin;
    }

    try {
        const {userId} = await req.json();
        const result = await deleteUser(userId);
        return successResponse(result);
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
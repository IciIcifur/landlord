import type {NextRequest} from "next/server";
import {AuthError, loginUser} from "@/app/lib/services/auth-service";
import {errorResponse, successResponse} from "@/app/lib/utils/response";

export async function POST(req: NextRequest) {
    try {
        const credentials = await req.json();
        const result = await loginUser(credentials);
        return successResponse(result);
    } catch (error: any) {
        if (error instanceof AuthError) {
            if (error.errors) {
                return errorResponse(error.errors, error.statusCode);
            }
            return errorResponse(error.message, error.statusCode);
        }
        return errorResponse("Ошибка на сервере", 500);
    }
}
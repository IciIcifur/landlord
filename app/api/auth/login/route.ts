import type {NextRequest} from "next/server";
import connectDB from "@/app/lib/utils/db";
import UserModel from "@/app/models/UserModel";
import { verifyPassword } from "@/app/lib/utils/auth";
import {errorResponse, successResponse} from "@/app/lib/utils/response";

export async function POST(req: NextRequest) {
    await connectDB();

    const {email, password} = await req.json();
    const errors: Record<string, string> = {};

    if (!email) errors.email = "Поле email обязательно";
    if (!password) errors.password = "Поле пароль обязательно";
    if (Object.keys(errors).length) {
        return errorResponse(errors, 400);
    }

    try {
        const user = await UserModel.findOne({email}).exec();
        if (!user) {
            return errorResponse({email: "Пользователь не найден"}, 404);
        }

        const isMatch = await verifyPassword(password, user.password);
        if (!isMatch) {
            return errorResponse({password: "Неверный пароль"}, 401);
        }

        return successResponse({id: user.id, role: user.role});
    } catch (error: any) {
        return errorResponse(error.message || "Ошибка на сервере", 500);
    }
}
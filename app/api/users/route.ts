import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";
import connectDB from "@/app/lib/utils/db";
import UserModel, {UserRole} from "@/app/models/UserModel";
import {hashPassword, requireAdmin, validatePassword} from "@/app/lib/utils/auth";
import {errorResponse, successResponse} from "@/app/lib/utils/response";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const admin = await requireAdmin(req);
        if (admin instanceof NextResponse) {
            return admin;
        }

        const users = await UserModel.find({}).select("id email role");

        return successResponse(users);
    } catch (error: any) {
        if (error.message === "Unauthorized" || error.message === "Admin access required") {
            return errorResponse(error.message, error.message === "Ошибка доступа" ? 401 : 403);
        }
        return errorResponse("Ошибка на сервере", 500);
    }
}

export async function POST(req: NextRequest) {
    await connectDB();
    const admin = await requireAdmin(req);
    if (admin instanceof NextResponse) {
        return admin;
    }

    const {email, password} = await req.json();
    const errors: Record<string, string> = {};

    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;
    if (!email) errors.email = 'Поле email обязательно';

    if (Object.keys(errors).length) {
        return errorResponse(errors, 400);
    }
    const hashedPassword = await hashPassword(password);
    try {
        let user = await UserModel.findOne({email}).exec();
        if (user) {
            user.password = hashedPassword;
            await user.save();
            return successResponse({id: user.id, message: 'Пароль обновлен'});
        } else {
            console.log("1");
            const newUser = new UserModel({
                email,
                password: hashedPassword,
                role: UserRole.CLIENT,
            });
            console.log(newUser);
            await newUser.save();
            return successResponse({id: newUser.id, message: 'Пользователь создан'}, 201);
        }
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            for (const key in error.errors) {
                errors[key] = error.errors[key].message;
            }
            return errorResponse(errors, 400);
        }
        errors.general = error.message || 'Ошибка на сервере';
        return errorResponse(errors, 500);
    }
}

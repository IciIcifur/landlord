import type {NextRequest} from "next/server"
import bcrypt from "bcryptjs"
import UserModel, {UserRole} from "@/app/models/UserModel"
import {errorResponse} from "@/app/lib/utils/response";
import {NextResponse} from "next/server";

export function validatePassword(password: string | undefined | null): string | null {
    if (typeof password !== 'string' || !password) {
        return 'Пароль обязателен';
    }
    if (password.length < 8) return 'Пароль должен содержать минимум 8 символов';
    if (password.length > 20) return 'Пароль не должен превышать 20 символов';
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
        return 'Пароль должен содержать как минимум одну заглавную букву, одну строчную букву, одну цифру и один специальный символ (@$!%*?&)';
    }
    return null;
}

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}

export async function requireUser(req: NextRequest) {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
        return errorResponse("ID пользователя обязателен", 401);
    }
    const user = await UserModel.findById(userId).select("id email role").lean();
    if (!user) {
        return errorResponse("Пользователь не найден", 401);
    }
    return user;
}

export async function requireAdmin(req: NextRequest) {
    const userOrError = await requireUser(req);
    if (userOrError instanceof NextResponse) {
        return userOrError;
    }
    const user = userOrError as { id: string; email: string; role: string };
    if (user.role !== UserRole.ADMIN) {
        return errorResponse("Ошибка доступа: требуется роль ADMIN", 403);
    }
    return user;
}

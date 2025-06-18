import bcrypt from "bcryptjs";
import UserModel, {UserRole} from "@/app/models/UserModel";
import connectDB from "@/app/lib/utils/db";

export interface AuthUser {
    id: string;
    email: string;
    role: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResult {
    id: string;
    role: string;
}

export class AuthError extends Error {
    public errors?: Record<string, string>;
    constructor(
        message: string,
        public field?: string,
        public statusCode = 400,
    ) {
        super(message);
        this.name = "AuthError";
    }
}

export function validatePassword(password: string | undefined | null): string | null {
    if (typeof password !== "string" || !password) {
        return "Пароль обязателен";
    }
    if (password.length < 8) return "Пароль должен содержать минимум 8 символов";
    if (password.length > 20) return "Пароль не должен превышать 20 символов";
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
        return "Пароль должен содержать как минимум одну заглавную букву, одну строчную букву, одну цифру и один специальный символ (@$!%*?&)";
    }
    return null;
}

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}

export async function loginUser(credentials: LoginCredentials): Promise<LoginResult> {
    await connectDB();

    const {email, password} = credentials;
    const errors: Record<string, string> = {};

    if (!email) errors.email = "Поле email обязательно";
    if (!password) errors.password = "Поле пароль обязательно";

    if (Object.keys(errors).length) {
        const error = new AuthError("Ошибки валидации", undefined, 400);
        (error as any).errors = errors;
        throw error;
    }

    try {
        const user = await UserModel.findOne({email}).exec();
        if (!user) {
            const error = new AuthError("Пользователь не найден", "email", 404);
            (error as any).errors = {email: "Пользователь не найден"};
            throw error;
        }

        const isMatch = await verifyPassword(password, user.password);
        if (!isMatch) {
            const error = new AuthError("Неверный пароль", "password", 401);
            (error as any).errors = {password: "Неверный пароль"};
            throw error;
        }

        return {id: user.id, role: user.role};
    } catch (error: any) {
        if (error instanceof AuthError) {
            throw error;
        }
        throw new AuthError(error.message || "Ошибка на сервере", undefined, 500);
    }
}

export async function getUserById(userId: string): Promise<AuthUser> {
    await connectDB();

    if (!userId) {
        throw new AuthError("ID пользователя обязателен", undefined, 401);
    }

    const user = await UserModel.findById(userId).select("id email role").lean();
    if (!user) {
        throw new AuthError("Пользователь не найден", undefined, 401);
    }

    return user as AuthUser;
}

export async function requireUserAccess(userId: string): Promise<AuthUser> {
    return await getUserById(userId);
}

export async function requireAdminAccess(userId: string): Promise<AuthUser> {
    const user = await getUserById(userId);

    if (user.role !== UserRole.ADMIN) {
        throw new AuthError("Ошибка доступа: требуется роль ADMIN", undefined, 403);
    }

    return user;
}
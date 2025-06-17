import type { NextRequest } from "next/server";
import connectDB from "@/app/lib/utils/db";
import UserModel from "@/app/models/UserModel";
import ObjectModel from "@/app/models/ObjectModel";
import { requireAdmin } from "@/app/lib/utils/auth";
import { errorResponse, successResponse } from "@/app/lib/utils/response";
import {NextResponse} from "next/server";

export async function DELETE(req: NextRequest) {
    await connectDB();
    const admin = await requireAdmin(req);
    if (admin instanceof NextResponse) {
        return admin;
    }

    const { userId } = await req.json();
    if (!userId) {
        return errorResponse({ id: "ID пользователя обязателен" }, 400);
    }

    try {
        const deletedUser = await UserModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            return errorResponse({ id: "Пользователь не найден" }, 404);
        }

        await ObjectModel.updateMany(
            { users: userId },
            { $pull: { userIds: userId } }
        );

        return successResponse({ userId, message: "Пользователь удален" });
    } catch (error: any) {
        return errorResponse(error.message || "Ошибка на сервере", 500);
    }
}
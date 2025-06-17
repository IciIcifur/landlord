import type { NextRequest } from "next/server";
import connectDB from "@/app/lib/utils/db";
import ObjectModel from "@/app/models/ObjectModel";
import UserModel from "@/app/models/UserModel";
import { requireAdmin } from "@/app/lib/utils/auth";
import { successResponse, errorResponse } from "@/app/lib/utils/response";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest, context: any) {
    await connectDB();
    const admin = await requireAdmin(req);
    if (admin instanceof NextResponse) return admin;
    const params = await context.params;
    const objectId = params.id;
    const { userId } = await req.json();

    if (!userId) return errorResponse("id пользователя обязателен", 400);

    try {
        const user = await UserModel.findById(userId).select("id");
        if (!user) return errorResponse("Пользователь не найден", 404);

        const obj = await ObjectModel.findByIdAndUpdate(
            objectId,
            { $addToSet: { users: userId } },
            { new: true }
        ).lean().exec();
        if (!obj) return errorResponse("Объект не найден", 404);

        return successResponse({ message: 'Пользователь добавлен' });
    } catch (error: any) {
        return errorResponse(error.message || "Ошибка на сервере", 500);
    }
}
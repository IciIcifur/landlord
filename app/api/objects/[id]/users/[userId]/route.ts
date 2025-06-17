import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";
import connectDB from "@/app/lib/utils/db";
import ObjectModel from "@/app/models/ObjectModel";
import {requireAdmin} from "@/app/lib/utils/auth";
import {errorResponse, successResponse} from "@/app/lib/utils/response";

export async function DELETE(req: NextRequest, context: any) {
    await connectDB();
    const adminOrError = await requireAdmin(req);
    if (adminOrError instanceof NextResponse) return adminOrError;
    const params = await context.params;
    const objectId = params.id;
    const userId = params.userId;

    try {
        const obj = await ObjectModel.findByIdAndUpdate(
            objectId,
            {$pull: {users: userId}},
            {new: true}
        ).lean().exec();
        if (!obj) return errorResponse("Объект не найден", 404);

        return successResponse({message: 'Пользователь удален'});
    } catch (error: any) {
        return errorResponse(error.message || "Ошибка на сервере", 500);
    }
}
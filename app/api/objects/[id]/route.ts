import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";
import connectDB from "@/app/lib/utils/db";
import ObjectModel from "@/app/models/ObjectModel";
import UserModel, {UserRole} from "@/app/models/UserModel";
import {requireAdmin, requireUser} from "@/app/lib/utils/auth";
import {errorResponse, successResponse} from "@/app/lib/utils/response";

export async function GET(req: NextRequest, context: any) {
    await connectDB();
    const user = await requireUser(req);
    if (user instanceof NextResponse) return user;
    const {id: userId, role} = user as { id: string; email: string; role: string };
    const params = await context.params;
    const objectId = params.id;

    try {
        const obj: any = await ObjectModel.findById(objectId)
            .select("id name address square description users")
            .lean();

        if (!obj) return errorResponse("Объект не найден", 404);

        if (role !== UserRole.ADMIN && !(obj.users || []).includes(userId)) {
            return errorResponse("Ошибка доступа", 403);
        }

        if (role === UserRole.ADMIN && obj.users && obj.users.length) {
            const users = await UserModel.find({_id: {$in: obj.users}}).select("id email").lean().exec();
            obj.users = users.map(u => ({id: u.id, email: u.email}));
        } else {
            delete obj.users;
        }

        return successResponse(obj);
    } catch (error: any) {
        return errorResponse(error.message || "Ошибка на сервере", 500);
    }
}

export async function PATCH(req: NextRequest, context: any) {
    await connectDB();
    const admin = await requireAdmin(req);
    if (admin instanceof NextResponse) return admin;
    const params = await context.params;
    const objectId = params.id;

    const allowedFields = ["name", "address", "square", "description"];
    const update = await req.json();
    const changes: any = {};
    for (const field of allowedFields) {
        if (update[field] !== undefined) changes[field] = update[field];
    }

    try {
        const obj: any = await ObjectModel.findById(objectId).lean();
        if (!obj) return errorResponse("Объект не найден", 404);

        await ObjectModel.findByIdAndUpdate(objectId, changes);

        return successResponse({message: 'Объект обновлен'});
    } catch (error: any) {
        return errorResponse(error.message || "Ошибка на сервере", 500);
    }
}

export async function DELETE(req: NextRequest, context: any) {
    await connectDB();
    const admin = await requireAdmin(req);
    if (admin instanceof NextResponse) return admin;
    const params = await context.params;
    const objectId = params.id;

    try {
        const obj = await ObjectModel.findByIdAndDelete(objectId);
        if (!obj) return errorResponse("Объект не найден", 404);

        return successResponse({message: "Объект удален"});
    } catch (error: any) {
        return errorResponse(error.message || "Ошибка на сервере", 500);
    }
}
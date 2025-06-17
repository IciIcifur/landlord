import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";
import connectDB from "@/app/lib/utils/db";
import ObjectModel from "@/app/models/ObjectModel";
import UserModel, {UserRole} from "@/app/models/UserModel";
import {errorResponse, successResponse} from "@/app/lib/utils/response";
import {requireAdmin, requireUser} from "@/app/lib/utils/auth";

export async function GET(req: NextRequest) {
    await connectDB();
    const user = await requireUser(req);
    if (user instanceof NextResponse) {
        return user;
    }
    const {id: userId, role} = user as { id: string; email: string; role: string };

    try {
        let objects;
        if (role === UserRole.ADMIN) {
            objects = await ObjectModel.find({})
                .select("id name address square users")
                .lean();
        } else {
            objects = await ObjectModel.find({users: userId})
                .select("id name address square")
                .lean();
        }

        if (role === UserRole.ADMIN) {
            const userIdsSet = new Set<string>();
            objects.forEach((obj: any) => {
                if (obj.users && Array.isArray(obj.users)) {
                    obj.users.forEach((uid: string) => userIdsSet.add(uid));
                }
            });
            const userIds = Array.from(userIdsSet);
            let usersById: Record<string, { id: string; email: string }> = {};
            if (userIds.length > 0) {
                const users = await UserModel.find({_id: {$in: userIds}}).select("id email").lean().exec();
                users.forEach((u: any) => {
                    usersById[u.id] = {id: u.id, email: u.email};
                });
            }
            objects = objects.map((obj: any) => ({
                ...obj,
                users: (obj.users || []).map((uid: string) => usersById[uid]).filter(Boolean),
            }));
        }

        return successResponse(objects);
    } catch (error: any) {
        return errorResponse(error.message || "Ошибка на сервере", 500);
    }
}

export async function POST(req: NextRequest) {
    await connectDB();
    const admin = await requireAdmin(req);
    if (admin instanceof NextResponse) {
        return admin;
    }

    const {name, address, square} = await req.json();
    const errors: Record<string, string> = {};
    if (!name) errors.name = "Название обязательно";
    if (!address) errors.address = "Адрес обязателен";
    if (typeof square !== "number" || isNaN(square)) errors.square = "Площадь обязательна";
    if (square < 0) errors.square = "Площадь не может быть отрицательной";

    if (Object.keys(errors).length) {
        return errorResponse(errors, 400);
    }

    try {
        const newObj = new ObjectModel({
            name,
            address,
            square,
            users: [],
        });
        await newObj.save();
        return successResponse({id: newObj.id}, 201);
    } catch (error: any) {
        return errorResponse(error.message || "Ошибка на сервере", 500);
    }
}
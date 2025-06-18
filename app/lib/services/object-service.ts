import ObjectModel from "@/app/models/ObjectModel"
import UserModel, {UserRole} from "@/app/models/UserModel"
import connectDB from "@/app/lib/utils/db"

export interface CreateObjectData {
    name: string
    address: string
    square: number
}

export interface UpdateObjectData {
    name?: string
    address?: string
    square?: number
    description?: string
}

export interface ObjectWithUsers {
    id: string
    name: string
    address: string
    square: number
    description?: string
    users?: Array<{ id: string; email: string }>
}

export class ObjectServiceError extends Error {
    public errors?: Record<string, string>

    constructor(
        message: string,
        public statusCode = 400,
        validationErrors?: Record<string, string>,
    ) {
        super(message)
        this.name = "ObjectServiceError"
        this.errors = validationErrors
    }
}

export async function getAllObjects(userId: string, userRole: string) {
    await connectDB()

    try {
        let objects
        if (userRole === UserRole.ADMIN) {
            objects = await ObjectModel.find({}).select("id name address square users").lean()
        } else {
            objects = await ObjectModel.find({users: userId}).select("id name address square").lean()
        }

        if (userRole === UserRole.ADMIN) {
            const userIdsSet = new Set<string>()
            objects.forEach((obj: any) => {
                if (obj.users && Array.isArray(obj.users)) {
                    obj.users.forEach((uid: string) => userIdsSet.add(uid))
                }
            })
            const userIds = Array.from(userIdsSet)
            const usersById: Record<string, { id: string; email: string }> = {}
            if (userIds.length > 0) {
                const users = await UserModel.find({_id: {$in: userIds}})
                    .select("id email")
                    .lean()
                    .exec()
                users.forEach((u: any) => {
                    usersById[u.id] = {id: u.id, email: u.email}
                })
            }
            objects = objects.map((obj: any) => ({
                ...obj,
                users: (obj.users || []).map((uid: string) => usersById[uid]).filter(Boolean),
            }))
        }

        return objects
    } catch (error: any) {
        throw new ObjectServiceError(error.message || "Ошибка на сервере", 500)
    }
}

export async function createObject(objectData: CreateObjectData): Promise<{ id: string }> {
    await connectDB()

    const {name, address, square} = objectData
    const validationErrors: Record<string, string> = {}

    if (!name) validationErrors.name = "Название обязательно"
    if (!address) validationErrors.address = "Адрес обязателен"
    if (typeof square !== "number" || isNaN(square)) validationErrors.square = "Площадь обязательна"
    if (square < 0) validationErrors.square = "Площадь не может быть отрицательной"

    if (Object.keys(validationErrors).length) {
        throw new ObjectServiceError("Ошибки валидации", 400, validationErrors)
    }

    try {
        const newObj = new ObjectModel({
            name,
            address,
            square,
            users: [],
        })
        await newObj.save()
        return {id: newObj.id}
    } catch (error: any) {
        throw new ObjectServiceError(error.message || "Ошибка на сервере", 500)
    }
}

export async function getObjectById(objectId: string, userId: string, userRole: string): Promise<ObjectWithUsers> {
    await connectDB()

    try {
        const obj: any = await ObjectModel.findById(objectId).select("id name address square description users").lean()

        if (!obj) {
            throw new ObjectServiceError("Объект не найден", 404)
        }

        if (userRole !== UserRole.ADMIN && !(obj.users || []).includes(userId)) {
            throw new ObjectServiceError("Ошибка доступа", 403)
        }

        if (userRole === UserRole.ADMIN && obj.users && obj.users.length) {
            const users = await UserModel.find({_id: {$in: obj.users}})
                .select("id email")
                .lean()
                .exec()
            obj.users = users.map((u) => ({id: u.id, email: u.email}))
        } else {
            delete obj.users
        }

        return obj
    } catch (error: any) {
        if (error instanceof ObjectServiceError) {
            throw error
        }
        throw new ObjectServiceError(error.message || "Ошибка на сервере", 500)
    }
}

export async function updateObject(objectId: string, updateData: UpdateObjectData): Promise<{ message: string }> {
    await connectDB()

    const allowedFields = ["name", "address", "square", "description"]
    const changes: any = {}
    for (const field of allowedFields) {
        if (updateData[field as keyof UpdateObjectData] !== undefined) {
            changes[field] = updateData[field as keyof UpdateObjectData]
        }
    }

    try {
        const obj: any = await ObjectModel.findById(objectId).lean()
        if (!obj) {
            throw new ObjectServiceError("Объект не найден", 404)
        }

        await ObjectModel.findByIdAndUpdate(objectId, changes)
        return {message: "Объект обновлен"}
    } catch (error: any) {
        if (error instanceof ObjectServiceError) {
            throw error
        }
        throw new ObjectServiceError(error.message || "Ошибка на сервере", 500)
    }
}

export async function deleteObject(objectId: string): Promise<{ message: string }> {
    await connectDB()

    try {
        const obj = await ObjectModel.findByIdAndDelete(objectId)
        if (!obj) {
            throw new ObjectServiceError("Объект не найден", 404)
        }

        return {message: "Объект удален"}
    } catch (error: any) {
        throw new ObjectServiceError(error.message || "Ошибка на сервере", 500)
    }
}

export async function addUserToObject(objectId: string, userId: string): Promise<{ message: string }> {
    await connectDB()

    if (!userId) {
        throw new ObjectServiceError("id пользователя обязателен", 400)
    }

    try {
        const user = await UserModel.findById(userId).select("id")
        if (!user) {
            throw new ObjectServiceError("Пользователь не найден", 404)
        }

        const obj = await ObjectModel.findByIdAndUpdate(objectId, {$addToSet: {users: userId}}, {new: true})
            .lean()
            .exec()

        if (!obj) {
            throw new ObjectServiceError("Объект не найден", 404)
        }

        return {message: "Пользователь добавлен"}
    } catch (error: any) {
        if (error instanceof ObjectServiceError) {
            throw error
        }
        throw new ObjectServiceError(error.message || "Ошибка на сервере", 500)
    }
}

export async function removeUserFromObject(objectId: string, userId: string): Promise<{ message: string }> {
    await connectDB()

    try {
        const obj = await ObjectModel.findByIdAndUpdate(objectId, {$pull: {users: userId}}, {new: true})
            .lean()
            .exec()

        if (!obj) {
            throw new ObjectServiceError("Объект не найден", 404)
        }

        return {message: "Пользователь удален"}
    } catch (error: any) {
        throw new ObjectServiceError(error.message || "Ошибка на сервере", 500)
    }
}

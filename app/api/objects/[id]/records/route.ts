import type {NextRequest} from "next/server"
import {NextResponse} from "next/server"
import {requireUser} from "@/app/lib/utils/auth"
import {getRecordsByObjectId, RecordServiceError} from "@/app/lib/services/record-service"
import {errorResponse, successResponse} from "@/app/lib/utils/response"

export async function GET(req: NextRequest, context: any) {
    const user = await requireUser(req)
    if (user instanceof NextResponse) return user
    const params = await context.params
    const objectId = params.id
    try {
        const records = await getRecordsByObjectId(objectId)
        return successResponse(records)
    } catch (error: any) {
        if (error instanceof RecordServiceError) {
            return errorResponse(error.message, error.statusCode)
        }
        return errorResponse("Ошибка на сервере", 500)
    }
}

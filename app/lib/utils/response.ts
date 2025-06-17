import {NextResponse} from "next/server";

export function successResponse<T>(data: T, status: number = 200) {
    return NextResponse.json(data, { status } as undefined);
}

export function errorResponse(
    errors: Record<string, string> | string,
    status: number = 400
) {
    const errorObj = typeof errors === 'string' ? { general: errors } : errors;
    return NextResponse.json({ errors: errorObj }, { status } as undefined);
}

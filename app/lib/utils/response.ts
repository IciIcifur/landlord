import { NextResponse } from 'next/server';

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(
  errors: Record<string, string> | string,
  status = 400,
) {
  const errorObj = typeof errors === 'string' ? { general: errors } : errors;
  return NextResponse.json({ errors: errorObj }, { status });
}

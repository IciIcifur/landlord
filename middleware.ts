import { NextRequest, NextResponse } from 'next/server';
import GetUserRole from '@/app/lib/utils/getUserRole';
import { UserRole } from '@/app/lib/utils/definitions';
import GetUserId from '@/app/lib/utils/getUserId';

const publicRoutes = ['/login'];
const protectedRoutes = ['/users'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isPublicRoute = publicRoutes.includes(path);
  const userId = await GetUserId();
  if (!isPublicRoute && !userId)
    return NextResponse.redirect(new URL('/login', req.nextUrl));

  const isProtectedRoute = protectedRoutes.includes(path);
  if (isProtectedRoute && (await GetUserRole()) !== UserRole.ADMIN)
    return NextResponse.redirect(new URL('/', req.nextUrl));

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

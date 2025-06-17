import 'server-only';
import { cookies } from 'next/headers';
import { UserRole } from '@/app/lib/utils/definitions';

export async function SetCookie(
  userId: string,
  userRole: UserRole,
  days: number = 7,
) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  const cookieStore = await cookies();

  const session = { userId: userId, userRole: userRole };

  cookieStore.set(
    'session' as any,
    JSON.stringify(session) as any,
    {
      httpOnly: true,
      secure: true,
      expires: expires as any,
      sameSite: 'lax',
      path: '/',
    } as any,
  );
}

export async function ClearCookie() {
  const cookieStore = await cookies();

  cookieStore.delete('session' as any);
}

'use server';

import { UserRole } from '@/app/lib/utils/definitions';
import { ClearCookie, SetCookie } from '@/app/lib/actions/cookies';

export async function setCookie(
  userId: string,
  userRole: UserRole,
  days?: number,
) {
  await SetCookie(userId, userRole, days);
}

export async function clearCookie() {
  await ClearCookie();
}

import 'server-only';
import { UserRole } from '@/app/lib/utils/definitions';
import { cookies } from 'next/headers';

export default async function GetUserRole(): Promise<UserRole | undefined> {
  const session: any = (await cookies()).get('session' as any)?.value;

  const role = JSON.parse(session).userRole;
  switch (UserRole[role]) {
    case 'ADMIN':
      return UserRole.ADMIN;
    case 'CLIENT':
      return UserRole.CLIENT;
    default:
      return undefined;
  }
}

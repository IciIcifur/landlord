import 'server-only';
import { cookies } from 'next/headers';

export default async function GetUserId(): Promise<string> {
  const session = (await cookies()).get('session' as any)?.value;
  if (!session) return '';
  return JSON.parse(session).userId;
}

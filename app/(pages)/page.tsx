import { cookies } from 'next/headers';
import GetUserRole from '@/app/lib/utils/getUserRole';

async function getObjects(id: string) {
  // get request for objects for this userId
}

export default async function MainPage() {
  const userRole = await GetUserRole();
  const userId = (await cookies()).get('userId' as any)?.value;

  return <div>Object list here</div>;
}

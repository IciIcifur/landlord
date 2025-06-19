import UserLoader from '@/app/loaders/userLoader';
import { RentalObject, User, UserRole } from '@/app/lib/utils/definitions';
import { ReactNode } from 'react';
import GetUserId from '@/app/lib/utils/getUserId';
import ObjectsLoader from '@/app/loaders/objectsLoader';
import MainNavbar from '@/app/ui/mainNavbar';
import FooterNavbar from '@/app/ui/footerNavbar';
import { GetAllObjects, GetUserById } from '@/app/lib/actions/clientApi';

async function getUser() {
  const userId = await GetUserId();
  if (userId) {
    try {
      const response: any = await GetUserById();
      if ('errors' in response)
        console.error('Не удалось получить пользователя...', response.errors);
      else
        return {
          id: userId,
          email: response.email,
          role: response.role === 'ADMIN' ? UserRole.ADMIN : UserRole.CLIENT,
        } as User;
    } catch (e) {
      console.error('Не удалось получить пользователя...');
    }
  }

  return null;
}

async function getObjects(): Promise<RentalObject[]> {
  const userId = await GetUserId();

  if (!userId) return [];
  try {
    const response: RentalObject[] | { errors: any } = await GetAllObjects();
    if ('errors' in response)
      console.error('Не удалось получить объекты...', response.errors);
    else return response;
  } catch (e) {
    console.error('Не удалось получить объекты...');
  }
  return [];
}

export default async function MainLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const user = await getUser();
  const objects = await getObjects();
  return (
    <>
      <UserLoader user={user} />
      <ObjectsLoader objects={objects} />

      <div className="flex min-h-screen flex-col">
        <MainNavbar />
        <div className="flex-1">{children}</div>
        <FooterNavbar />
      </div>
    </>
  );
}

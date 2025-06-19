import UserLoader from '@/app/loaders/userLoader';
import { RentalObject, User, UserRole } from '@/app/lib/utils/definitions';
import { ReactNode } from 'react';
import GetUserId from '@/app/lib/utils/getUserId';
import ObjectsLoader from '@/app/loaders/objectsLoader';
import MainNavbar from '@/app/ui/mainNavbar';
import FooterNavbar from '@/app/ui/footerNavbar';
import GetUserRole from '@/app/lib/utils/getUserRole';
import { GetAllObjects } from '@/app/lib/actions/clientApi';

async function getUser() {
  const userId = await GetUserId();
  if (!userId) {
    return null;
  }

  await GetUserRole;

  // TODO: get user data by id
  const user: User = {
    id: userId,
    email: 'abracadabra@gmail.com',
    role: UserRole.ADMIN,
  };

  return user;
}

async function getObjects() {
  const userId = await GetUserId();

  try {
    const allObjects: RentalObject[] = await GetAllObjects(userId);
    if (allObjects) return allObjects;
    else console.error('Не удалось получить объекты...');
  } catch (e) {
    console.error(e);
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

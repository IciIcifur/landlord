import UserLoader from '@/app/loaders/userLoader';
import { User, UserRole } from '@/app/lib/utils/definitions';
import { ReactNode } from 'react';
import GetUserId from '@/app/lib/utils/getUserId';
import ObjectsLoader from '@/app/loaders/objectsLoader';

async function getUser() {
  const userId = await GetUserId();
  if (!userId) {
    return null;
  }

  // TODO: get user data by id
  const user: User | undefined = {
    id: userId,
    email: 'abracadabra@gmail.com',
    role: UserRole.ADMIN,
  };

  return user;
}

async function getObjects() {
  const userId = await GetUserId();
  return [
    { id: '1', name: 'Проект 1', price: 5000 },
    { id: '2', name: 'Проект 2', price: 7500 },
    { id: '3', name: 'Проект 3', price: 3200 },
    { id: '4', name: 'Проект 4', price: 9800 },
    { id: '5', name: 'Проект 5', price: 6400 },
  ];
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
      {children}
    </>
  );
}

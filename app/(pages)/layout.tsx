import UserLoader from '@/app/loaders/userLoader';
import { User, UserRole } from '@/app/lib/utils/definitions';
import { ReactNode } from 'react';
import GetUserId from '@/app/lib/utils/getUserId';

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

export default async function MainLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const user = await getUser();
  return (
    <>
      <UserLoader user={user} />
      {children}
    </>
  );
}

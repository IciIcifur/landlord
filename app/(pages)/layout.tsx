import UserLoader from '@/app/loaders/userLoader';
import { RentalObject, User, UserRole } from '@/app/lib/utils/definitions';
import { ReactNode } from 'react';
import GetUserId from '@/app/lib/utils/getUserId';
import ObjectsLoader from '@/app/loaders/objectsLoader';

async function getUser() {
  const userId = await GetUserId();
  if (!userId) {
    return null;
  }

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
  return [
    {
      id: '1',
      name: 'Офис в центре Москвы',
      square: 50,
      address: 'ул. Тверская, д. 7, Москва',
      description: 'Современный офис с ремонтом и парковкой',
      users: [
        { id: '1', email: 'ivan.petrov@example.com' },
        { id: '2', email: 'elena.smirnova@example.com' },
        { id: '3', email: 'alexey.ivanov@example.com' },
        { id: '4', email: 'maria.kuznetsova@example.com' },
      ],
    },
    {
      id: '2',
      name: 'Склад на юге города',
      square: 75,
      address: 'ул. Южная, д. 15, Санкт-Петербург',
      description: 'Теплый склад с погрузочной зоной',
    },
    {
      id: '3',
      name: 'Коворкинг у метро',
      square: 32,
      address: 'пр-т Ленина, д. 3, Екатеринбург',
      // description отсутствует, поле необязательное
    },
    {
      id: '4',
      name: 'Магазин на первой линии',
      square: 98,
      address: 'ул. Советская, д. 10, Казань',
      description: 'Помещение под торговлю с витринами',
    },
    {
      id: '5',
      name: 'Офис в бизнес-центре',
      square: 64,
      address: 'пр-т Мира, д. 21, Новосибирск',
      description: 'Уютный офис с панорамными окнами',
    },
  ] as RentalObject[];
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

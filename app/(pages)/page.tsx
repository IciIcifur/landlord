import GetUserRole from '@/app/lib/utils/getUserRole';
import ObjectsList from '@/app/ui/objects/objectsList';
import { UserRole } from '@/app/lib/utils/definitions';
import GetUserId from '@/app/lib/utils/getUserId';
import ObjectsLoader from '@/app/loaders/objectsLoader';

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

export default async function MainPage() {
  const userRole = await GetUserRole();
  const objects = await getObjects();

  return (
    <>
      <ObjectsLoader objects={objects} />
      <div className="container mx-auto p-6">
        <div className="mx-auto mb-6 max-w-2xl">
          <h1 className="text-2xl font-medium">Строительные проекты</h1>
          <p className="text-default-500">
            {userRole === UserRole.ADMIN
              ? 'Панель администратора для управления проектами'
              : 'Просмотр доступных строительных проектов для аренды'}
          </p>
        </div>

        <ObjectsList />
      </div>
    </>
  );
}

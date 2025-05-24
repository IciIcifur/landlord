import GetUserRole from '@/app/lib/utils/getUserRole';
import ObjectsList from '@/app/ui/objects/objectsList';
import { UserRole } from '@/app/lib/utils/definitions';

export default async function MainPage() {
  const userRole = await GetUserRole();

  return (
    <>
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

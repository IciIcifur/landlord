import GetUserRole from '@/app/lib/utils/getUserRole';
import ObjectsList from '@/app/ui/objects/objectsList';
import { UserRole } from '@/app/lib/utils/definitions';

export default async function MainPage() {
  const userRole = await GetUserRole();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 p-6">
      <div className="flex w-full flex-col flex-nowrap items-start justify-center gap-1 p-4">
        <h1 className="text-2xl font-medium">Объекты аренды</h1>
        <p className="text-small text-default-400">
          {userRole === UserRole.ADMIN
            ? 'Панель администратора для управления объектами'
            : 'Доступные объекты аренды'}
        </p>
      </div>

      <ObjectsList />
    </div>
  );
}

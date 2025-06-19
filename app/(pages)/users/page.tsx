import { User } from '@/app/lib/utils/definitions';
import UsersLoader from '@/app/loaders/usersLoader';
import UsersContent from '@/app/ui/users/usersContent';
import { GetAllUsers } from '@/app/lib/actions/clientApi';
import GetUserId from '@/app/lib/utils/getUserId';

async function getUsers() {
  const userId = await GetUserId();
  if (userId) {
    try {
      const response: any = await GetAllUsers();

      if ('errors' in response)
        console.error('Не удалось получить пользователей...', response.errors);
      else return response as User[];
    } catch (e) {
      console.error('Не удалось получить пользователей...');
    }
  }

  return [] as User[];
}

export default async function UsersPage() {
  const allUsers = await getUsers();
  return (
    <>
      <UsersLoader users={allUsers} />
      <div className="mx-auto flex max-w-5xl flex-col gap-4 p-6">
        <div className="flex w-full flex-col flex-nowrap items-start justify-center gap-1 p-4">
          <h1 className="text-2xl font-medium">Управление пользователями</h1>
          <p className="text-small text-default-400">
            Панель администратора для управления доступом к объектам
          </p>
        </div>

        <div className="w-full">
          <UsersContent />
        </div>
      </div>
    </>
  );
}

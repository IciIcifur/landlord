import { User, UserRole } from '@/app/lib/utils/definitions';
import UsersLoader from '@/app/loaders/usersLoader';
import UsersContent from '@/app/ui/users/usersContent';

async function getUsers() {
  // TODO: await user list
  return [
    { id: '1', email: 'ivan.petrov@example.com', role: UserRole.CLIENT },
    { id: '2', email: 'elena.smirnova@example.com', role: UserRole.CLIENT },
    { id: '3', email: 'alexey.ivanov@example.com', role: UserRole.CLIENT },
    { id: '4', email: 'maria.kuznetsova@example.com', role: UserRole.CLIENT },
    { id: '5', email: 'dmitry.volkov@example.com', role: UserRole.CLIENT },
    { id: '6', email: 'olga.nikolaeva@example.com', role: UserRole.CLIENT },
    { id: '7', email: 'sergey.morozov@example.com', role: UserRole.CLIENT },
    { id: '8', email: 'natalia.novikova@example.com', role: UserRole.CLIENT },
    { id: '9', email: 'andrey.fedorov@example.com', role: UserRole.CLIENT },
    { id: '10', email: 'irina.egorova@example.com', role: UserRole.CLIENT },
  ] as User[];
}

export default async function UsersPage() {
  const allUsers = await getUsers();
  return (
    <>
      <UsersLoader users={allUsers} />
      <div className="mx-auto flex max-w-3xl flex-col gap-4 p-6">
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

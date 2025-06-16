import ObjectAccess from '@/app/ui/objects/objectAccess';
import { User, UserRole } from '@/app/lib/utils/definitions';
import UsersLoader from '@/app/loaders/usersLoader';

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
      <div className="container mx-auto p-6">
        <div className="mx-auto mb-6 max-w-2xl">
          <h1 className="text-2xl font-medium">Управление пользователями</h1>
          <p className="text-default-500">
            Панель администратора для управления доступом к объектам
          </p>
        </div>

        <ObjectAccess />
      </div>
    </>
  );
}

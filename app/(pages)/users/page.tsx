import ObjectsList from '@/app/ui/objects/objectsList';

export default function UsersPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mx-auto mb-6 max-w-2xl">
        <h1 className="text-2xl font-medium">Управление пользователями</h1>
        <p className="text-default-500">
          Панель администратора для управления доступами к объектам
        </p>
      </div>

      <ObjectsList />
    </div>
  );
}

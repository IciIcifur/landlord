'use client';
import { Tab, Tabs } from '@heroui/tabs';
import ObjectAccess from '@/app/ui/objects/objectAccess';
import UsersList from '@/app/ui/users/usersList';

export default function UsersContent() {
  return (
    <Tabs
      fullWidth
      size="lg"
      color="primary"
      classNames={{ tab: 'text-sm font-medium' }}
    >
      <Tab key="access" title="Доступ к объекту">
        <ObjectAccess />
      </Tab>
      <Tab key="users" title="Все пользователи">
        <UsersList />
      </Tab>
    </Tabs>
  );
}

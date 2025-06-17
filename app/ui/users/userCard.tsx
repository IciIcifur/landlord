'use client';
import { User } from '@/app/lib/utils/definitions';
import { Button } from '@heroui/button';
import { TrashIcon } from 'lucide-react';

export default function UserCard({
  user,
  onDelete,
}: {
  user: User;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="group flex w-full items-center justify-between gap-2">
      <div className="flex flex-col">
        <h2 className="text-small font-medium">{user.email}</h2>
        <p className="text-xs text-default-500">ID: {user.id}</p>
      </div>
      <Button
        color="danger"
        variant="flat"
        isIconOnly
        className="invisible group-hover:visible"
        onPress={() => onDelete(user.id)}
      >
        <TrashIcon className="size-4" />
      </Button>
    </div>
  );
}

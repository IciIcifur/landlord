'use client';
import { User } from '@/app/lib/utils/definitions';
import { Chip } from '@heroui/chip';
import { XIcon } from 'lucide-react';
import userStore from '@/app/stores/userStore';
import { ReactNode } from 'react';

export default function UserChip({
  user,
  onDelete,
}: {
  user: User;
  onDelete: (id: string) => void;
}) {
  return (
    <Chip
      variant="flat"
      color={user.id !== userStore.user?.id ? 'primary' : 'secondary'}
      className="text-default-600"
      size="md"
      isDisabled={user.id === userStore.user?.id}
      onClose={() => onDelete(user.id)}
      endContent={(<XIcon className="h-5 stroke-default-500" />) as ReactNode}
    >
      {user.email}
    </Chip>
  );
}

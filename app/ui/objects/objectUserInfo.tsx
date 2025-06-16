'use client';

import { RentalObject } from '@/app/lib/utils/definitions';
import { Card, CardBody } from '@heroui/card';
import UserCard from '@/app/ui/users/userCard';

export default function ObjectUserInfo({ object }: { object: RentalObject }) {
  return (
    <Card className="w-full">
      <CardBody className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex w-full flex-nowrap items-center gap-2">
              <h3 className="text-lg font-medium">{object.name}</h3>
              <p className="text-xs text-default-400">ID: {object.id}</p>
            </div>
          </div>
          <div className="flex w-full justify-between gap-4">
            <p className="w-full text-small font-medium text-default-400">
              {object.address}
            </p>
          </div>
        </div>
        {object.users?.length ? (
          <div className="flex flex-col gap-1">
            {object.users?.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <p className="w-full text-small font-medium text-default-500">
            Нет пользователей, которым доступен объект
          </p>
        )}
      </CardBody>
    </Card>
  );
}

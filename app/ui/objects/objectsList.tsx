'use client';

import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import Link from 'next/link';
import { PencilIcon, PlusIcon, TrashIcon, UsersIcon } from 'lucide-react';
import { UserRole } from '@/app/lib/utils/definitions';
import { useEffect, useState } from 'react';

interface ObjectProps {
  id: string;
  name: string;
  price: number;
}

interface ObjectsListProps {
  objects: ObjectProps[];
  userRole: UserRole | undefined;
}

export default function ObjectsList({ objects, userRole }: ObjectsListProps) {
  const [isAdmin, setIsAdmin] = useState(userRole === UserRole.ADMIN);

  useEffect(() => {
    setIsAdmin(userRole === UserRole.ADMIN);
  }, [userRole, setIsAdmin]);

  const handleEdit = (id: string) => {
    console.log(`Редактирование проекта ${id}`);
  };

  const handleDelete = (id: string) => {
    console.log(`Удаление проекта ${id}`);
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      {isAdmin && (
        <div className="mb-4 flex items-center justify-between">
          <Button
            color="primary"
            startContent={<PlusIcon className="size-4" />}
          >
            Добавить новый проект
          </Button>

          <Button
            as={Link}
            href="/users"
            color="default"
            variant="flat"
            startContent={<UsersIcon className="size-4" />}
          >
            Управление пользователями
          </Button>
        </div>
      )}

      {objects.map((object) => (
        <Card key={object.id} className="w-full">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">{object.name}</h3>
                <p className="text-default-500">ID: {object.id}</p>
                <p className="mt-1 font-medium text-primary">
                  {object.price} ₽
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  as={Link}
                  href={`/${object.id}`}
                  color="primary"
                  size="sm"
                  variant="flat"
                >
                  Подробнее
                </Button>

                {isAdmin && (
                  <>
                    <Button
                      color="default"
                      size="sm"
                      variant="flat"
                      isIconOnly
                      onPress={() => handleEdit(object.id)}
                    >
                      <PencilIcon className="size-4" />
                    </Button>
                    <Button
                      color="danger"
                      size="sm"
                      variant="flat"
                      isIconOnly
                      onPress={() => handleDelete(object.id)}
                    >
                      <TrashIcon className="size-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      ))}

      {objects.length === 0 && (
        <Card className="w-full">
          <CardBody className="p-6 text-center">
            <p className="text-default-500">Строительные проекты не найдены.</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

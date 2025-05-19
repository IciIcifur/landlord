'use client';

import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import Link from 'next/link';
import { PencilIcon, PlusIcon, TrashIcon, UsersIcon } from 'lucide-react';
import { UserRole } from '@/app/lib/utils/definitions';
import { useState } from 'react';
import { useDisclosure } from '@heroui/modal';
import EditObjectModal from '@/app/ui/modals/editObjectModal';
import AreYouSureModal from '@/app/ui/modals/areYouSureModal';
import objectsStore from '@/app/stores/objectsStore';
import userStore from '@/app/stores/userStore';
import { observer } from 'mobx-react-lite';

const ObjectsList = observer(() => {
  const [activeObjectId, setActiveObjectId] = useState<string | undefined>(
    undefined,
  );
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();

  const handleDelete = () => {
    console.log('Delete object: ', activeObjectId);
    onDeleteOpenChange();
  };

  return (
    <>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        {userStore.user?.role === UserRole.ADMIN && (
          <div className="mb-4 flex items-center justify-between gap-2">
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

        {objectsStore.allObjects.map((object) => (
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

                  {userStore.user?.role === UserRole.ADMIN && (
                    <>
                      <Button
                        color="default"
                        size="sm"
                        variant="flat"
                        isIconOnly
                        onPress={() => {
                          setActiveObjectId(object.id);
                          onEditOpen();
                        }}
                      >
                        <PencilIcon className="size-4" />
                      </Button>
                      <Button
                        color="danger"
                        size="sm"
                        variant="flat"
                        isIconOnly
                        onPress={() => {
                          setActiveObjectId(object.id);
                          onDeleteOpen();
                        }}
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

        {!objectsStore.allObjects.length && (
          <Card className="w-full">
            <CardBody className="p-6 text-center">
              <p className="text-default-500">
                Строительные проекты не найдены.
              </p>
            </CardBody>
          </Card>
        )}
      </div>
      {isEditOpen && (
        <EditObjectModal
          object={objectsStore.allObjects.find(
            (object) => object.id === activeObjectId,
          )}
          isOpen={isEditOpen}
          onOpenChange={onEditOpenChange}
        />
      )}
      {isDeleteOpen && (
        <AreYouSureModal
          header={`Вы уверены, что хотите удалить "${objectsStore.allObjects.find((object) => object.id === activeObjectId)?.name}"?`}
          description="Объект будет удален без возможности восстановления данных о нем."
          onSubmit={handleDelete}
          isOpen={isDeleteOpen}
          onOpenChange={onDeleteOpenChange}
        />
      )}
    </>
  );
});

export default ObjectsList;

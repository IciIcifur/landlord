'use client';

import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import Link from 'next/link';
import { PlusIcon, UsersIcon } from 'lucide-react';
import { UserRole } from '@/app/lib/utils/definitions';
import { useState } from 'react';
import { useDisclosure } from '@heroui/modal';
import EditObjectModal from '@/app/ui/modals/editObjectModal';
import AreYouSureModal from '@/app/ui/modals/areYouSureModal';
import objectsStore from '@/app/stores/objectsStore';
import userStore from '@/app/stores/userStore';
import { observer } from 'mobx-react-lite';
import ObjectCard from '@/app/ui/objects/objectCard';
import AddObjectModal from '@/app/ui/modals/addObjectModal';

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
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onOpenChange: onAddOpenChange,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();

  const handleDelete = () => {
    // TODO: delete activeObjectId
    if (activeObjectId) {
      objectsStore.deleteObjectById(activeObjectId);
    }
    onDeleteOpenChange();
  };

  return (
    <>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        {userStore.user?.role === UserRole.ADMIN && (
          <div className="mb-4 flex items-center justify-between gap-2">
            <Button
              as={Link}
              href="/users"
              color="default"
              variant="flat"
              startContent={<UsersIcon className="size-4" />}
            >
              Управление пользователями
            </Button>
            <Button
              onPress={onAddOpen}
              color="primary"
              startContent={<PlusIcon className="size-4" />}
            >
              Новый объект
            </Button>
          </div>
        )}

        {objectsStore.allObjects.map((object) => (
          <ObjectCard
            key={object.id}
            object={object}
            onDeleteOpen={onDeleteOpen}
            onEditOpen={onEditOpen}
            setActiveId={setActiveObjectId}
          />
        ))}

        {!objectsStore.allObjects.length && (
          <Card className="w-full">
            <CardBody className="p-6 text-center">
              <p className="text-default-500">Объекты аренды не найдены.</p>
            </CardBody>
          </Card>
        )}
      </div>
      {isEditOpen && activeObjectId && (
        <EditObjectModal
          object={objectsStore.getObjectById(activeObjectId)}
          isOpen={isEditOpen}
          onOpenChange={onEditOpenChange}
        />
      )}
      {isAddOpen && (
        <AddObjectModal isOpen={isAddOpen} onOpenChange={onAddOpenChange} />
      )}
      {isDeleteOpen && activeObjectId && (
        <AreYouSureModal
          header={`Вы уверены, что хотите удалить "${objectsStore.getObjectById(activeObjectId).name}"?`}
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

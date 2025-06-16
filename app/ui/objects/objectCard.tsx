'use client';
import { RentalObject, UserRole } from '@/app/lib/utils/definitions';
import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import Link from 'next/link';
import userStore from '@/app/stores/userStore';
import { PencilIcon, TrashIcon } from 'lucide-react';

export default function ObjectCard({
  object,
  setActiveId,
  onEditOpen,
  onDeleteOpen,
}: {
  object: RentalObject;
  setActiveId: (id: string | undefined) => void;
  onEditOpen: () => void;
  onDeleteOpen: () => void;
}) {
  const handleEdit = () => {
    setActiveId(object.id);
    onEditOpen();
  };
  const handleDelete = () => {
    setActiveId(object.id);
    onDeleteOpen();
  };
  return (
    <Card key={object.id} className="w-full">
      <CardBody className="flex flex-col gap-1 p-4">
        <div className="flex items-center justify-between">
          <div className="flex w-full flex-nowrap items-center gap-2">
            <h3 className="text-lg font-medium">{object.name}</h3>
            <p className="text-xs text-default-400">ID: {object.id}</p>
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
                  onPress={handleEdit}
                >
                  <PencilIcon className="size-4" />
                </Button>
                <Button
                  color="danger"
                  size="sm"
                  variant="flat"
                  isIconOnly
                  onPress={handleDelete}
                >
                  <TrashIcon className="size-4" />
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="flex w-full justify-between gap-4">
          <p className="w-full text-small font-medium text-default-400">
            {object.address}
          </p>
        </div>
        <div className="flex w-full items-end justify-end gap-4">
          {object.description?.length ? (
            <p className="w-full text-small font-medium text-default-500">
              {object.description}
            </p>
          ) : (
            <p className="w-full text-small font-medium text-default-300">
              У объекта пока нет описания...
            </p>
          )}
          <p className="w-fit text-nowrap font-medium text-primary">
            {object.square} м²
          </p>
        </div>
      </CardBody>
    </Card>
  );
}

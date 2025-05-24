'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ObjectSearch from '@/app/ui/objects/objectSearch';
import ObjectDetail from '@/app/ui/objects/objectDetail';
import objectsStore from '@/app/stores/objectsStore';
import { Button } from '@heroui/button';
import { PlusIcon } from 'lucide-react';
import { Card, CardBody } from '@heroui/card';

export default function ObjectAccess() {
  const router = useRouter();
  const queryParams = useSearchParams();
  const initialObjectId = queryParams.get('object_id');
  const [selectedObjectId, setSelectedObjectId] = useState(initialObjectId);

  useEffect(() => {
    if (initialObjectId !== selectedObjectId)
      setSelectedObjectId(initialObjectId);
  }, [initialObjectId]);

  useEffect(() => {
    if (initialObjectId !== selectedObjectId) {
      const newParams = new URLSearchParams(queryParams);
      newParams.set('object_id', selectedObjectId);
      router.replace(`?${newParams.toString()}`);
    }
  }, [selectedObjectId, queryParams]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div className="flex w-full items-center justify-between gap-4">
        <ObjectSearch
          selectedId={selectedObjectId}
          setSelectedId={setSelectedObjectId}
        />

        <Button
          variant="flat"
          color="primary"
          startContent={<PlusIcon className="size-4" />}
        >
          Новый пользователь
        </Button>
      </div>

      {selectedObjectId ? (
        <ObjectDetail
          object={objectsStore.allObjects.find(
            (object) => object.id === selectedObjectId,
          )}
        />
      ) : (
        <Card className="w-full">
          <CardBody className="items-center justify-center gap-2 p-6">
            <p className="text-default-500">Объект не выбран</p>
            <p className="text-xs text-default-600">
              Выберите объект, чтобы настроить пользователей, которым он
              доступен.
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

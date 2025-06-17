'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ObjectSearch from '@/app/ui/objects/objectSearch';
import { Card, CardBody } from '@heroui/card';
import ObjectUserInfo from '@/app/ui/objects/objectUserInfo';

export default function ObjectAccess() {
  const router = useRouter();
  const queryParams = useSearchParams();
  const [selectedObjectId, setSelectedObjectId] = useState('');

  useEffect(() => {
    const initialObjectId = queryParams.get('object_id');
    setSelectedObjectId(initialObjectId);
  }, []);

  useEffect(() => {
    if (selectedObjectId && selectedObjectId !== queryParams.get('object_id')) {
      const newParams = new URLSearchParams(queryParams);
      newParams.set('object_id', selectedObjectId);
      router.replace(`?${newParams.toString()}`);
    }
  }, [selectedObjectId]);

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full items-center justify-between gap-4">
        <ObjectSearch
          selectedId={selectedObjectId}
          setSelectedId={setSelectedObjectId}
        />
      </div>

      {selectedObjectId ? (
        <ObjectUserInfo objectId={selectedObjectId} />
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

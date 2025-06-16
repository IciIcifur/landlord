'use client';

import { Card, CardBody } from '@heroui/card';
import { RentalObject } from '@/app/lib/utils/definitions';
import ObjectMainForm from '@/app/ui/forms/objectMainForm';
import ObjectNotFoundCard from '@/app/ui/objects/objectNotFoundCard';

export default function ObjectDetail({
  object,
}: {
  object: RentalObject | null;
}) {
  return object ? (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 p-6">
      <div className="flex w-full flex-col flex-nowrap items-start justify-center gap-1 p-4">
        <h1 className="text-2xl font-medium">{object.name}</h1>
        <p className="text-small text-default-400">ID: {object.id}</p>
      </div>

      <Card className="w-full">
        <CardBody className="flex flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <h3 className="w-full text-lg font-medium">Общая информация</h3>
          </div>
          <ObjectMainForm object={object} />
          {/*TODO: records + data for sale*/}
        </CardBody>
      </Card>
    </div>
  ) : (
    <div className="flex h-screen items-center justify-center">
      <ObjectNotFoundCard />
    </div>
  );
}

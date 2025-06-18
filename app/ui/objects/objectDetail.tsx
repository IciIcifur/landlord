'use client';

import { Card, CardBody } from '@heroui/card';
import ObjectMainForm from '@/app/ui/forms/objectMainForm';
import ObjectNotFoundCard from '@/app/ui/objects/objectNotFoundCard';
import { observer } from 'mobx-react-lite';
import objectsStore from '@/app/stores/objectsStore';
import DataForSaleForm from '@/app/ui/forms/dataForSaleForm';
import DataForSaleTable from '@/app/ui/objects/dataForSaleTable';
import { ReactNode } from 'react';
import { Button } from '@heroui/button';
import { FileDownIcon } from 'lucide-react';
import { Tab, Tabs } from '@heroui/tabs';

const ObjectDetail = observer(() => {
  return objectsStore.activeObject ? (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 p-6">
      <div className="flex w-full flex-col flex-nowrap items-start justify-center gap-1 p-4">
        <h1 className="text-2xl font-medium">
          {objectsStore.activeObject.name}
        </h1>
        <p className="text-small text-default-400">
          ID: {objectsStore.activeObject.id}
        </p>
      </div>
      <Tabs
        fullWidth
        size="lg"
        color="primary"
        classNames={{ tab: 'text-sm font-medium', panel: 'p-0' }}
      >
        <Tab key="records" title="Записи по объекту"></Tab>
        <Tab key="info" title="Информация об объекте">
          <div className="flex flex-col gap-4">
            <Card className="w-full">
              <CardBody className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="w-full text-lg font-medium">
                    Общая информация
                  </h3>
                </div>
                <ObjectMainForm object={objectsStore.activeObject} />
              </CardBody>
            </Card>

            <Card className="w-full">
              <CardBody className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="w-full text-lg font-medium">
                    Коммерческая информация
                  </h3>
                  <Button
                    onPress={() => {
                      /*TODO: download excel*/
                    }}
                    isIconOnly
                    variant="light"
                    color="secondary"
                    className="h-7 w-7 min-w-7"
                  >
                    <FileDownIcon className="w-5" />
                  </Button>
                </div>
                {objectsStore.activeObjectDataForSale &&
                  ((
                    <DataForSaleTable
                      dataForSale={objectsStore.activeObjectDataForSale}
                    />
                  ) as ReactNode)}
                <DataForSaleForm
                  dataForSale={objectsStore.activeObject.dataForSale}
                />
              </CardBody>
            </Card>
          </div>
        </Tab>
      </Tabs>
    </div>
  ) : (
    <ObjectNotFoundCard />
  );
});

export default ObjectDetail;

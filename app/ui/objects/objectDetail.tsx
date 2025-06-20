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
import userStore from '@/app/stores/userStore';
import { UserRole } from '@/app/lib/utils/definitions';
import ObjectRecordsTable from '@/app/ui/objects/objectRecordsTable';
import { ExportObjectToExcel } from "@/app/lib/actions/clientApi"

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
        <Tab key="records" title="Записи по объекту">
          <ObjectRecordsTable />
        </Tab>
        <Tab key="info" title="Информация">
          <div className="flex flex-col gap-4">
            <Card className="w-full">
              <CardBody className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="w-full text-lg font-medium">
                    Общая информация
                  </h3>
                </div>
                <ObjectMainForm
                  isReadonly={!(userStore.user?.role === UserRole.ADMIN)}
                  object={objectsStore.activeObject}
                />
              </CardBody>
            </Card>
            {userStore.user?.role == UserRole.ADMIN &&
              ((
                <>
                  <Card className="w-full">
                    <CardBody className="flex flex-col gap-4 p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="w-full text-lg font-medium">
                          Коммерческая информация
                        </h3>
                        <Button
                          onPress={async () => {
                            if (!objectsStore.activeObject) return

                            try {
                              const blob = await ExportObjectToExcel(objectsStore.activeObject.id, false)

                              const url = window.URL.createObjectURL(blob)
                              const link = document.createElement("a")
                              link.href = url
                              link.download = `${objectsStore.activeObject.name}_records.csv`
                              document.body.appendChild(link)
                              link.click()
                              document.body.removeChild(link)
                              window.URL.revokeObjectURL(url)
                            } catch (error) {
                              console.error("Ошибка при экспорте:", error)
                            }
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
                  </Card>{' '}
                </>
              ) as ReactNode)}
          </div>
        </Tab>
      </Tabs>
    </div>
  ) : (
    <ObjectNotFoundCard />
  );
});

export default ObjectDetail;

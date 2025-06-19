'use client';
import { DataForSale } from '@/app/lib/utils/definitions';
import { Form } from '@heroui/form';
import { NumberInput } from '@heroui/number-input';
import { useEffect, useState } from 'react';
import CheckFormFields from '@/app/lib/utils/checkFormFields';
import { dataForSaleFormSchema } from '@/app/lib/utils/zodSchemas';
import { Button } from '@heroui/button';
import objectsStore from '@/app/stores/objectsStore';
import { RussianRubleIcon } from 'lucide-react';
import { UpdateDataForSale } from '@/app/lib/actions/clientApi';

export default function DataForSaleForm({
  dataForSale,
}: {
  dataForSale: DataForSale | undefined;
}) {
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const [purchasePrice, setPurchasePrice] = useState(
    dataForSale?.purchasePrice,
  );
  const [priceForSale, setPriceForSale] = useState(dataForSale?.priceForSale);

  useEffect(() => {
    setErrors(
      CheckFormFields(
        {
          purchasePrice: purchasePrice || undefined,
          priceForSale: priceForSale || undefined,
        },
        dataForSaleFormSchema,
      ),
    );
  }, [purchasePrice, priceForSale, setErrors]);

  const onSubmit = async () => {
    if (!objectsStore.activeObject) return;
    setIsLoading(true);
    try {
      const response: any = await UpdateDataForSale(
        objectsStore.activeObject.id,
        {
          purchasePrice,
          priceForSale,
        },
      );
      if (!('errors' in response)) {
        objectsStore.updateActiveObjectDataForSale({
          purchasePrice,
          priceForSale,
        });
      } else {
        setErrors(response.errors);
      }
    } catch (e) {
      console.error(e);
    }

    setIsLoading(false);
  };

  return (
    <Form validationErrors={errors}>
      <div className="flex w-full flex-col items-end gap-2">
        <div className="flex w-full flex-wrap justify-between gap-2 sm:flex-nowrap">
          <NumberInput
            value={purchasePrice}
            onValueChange={setPurchasePrice}
            errorMessage={errors.purchasePrice}
            label="Цена покупки"
            placeholder="100,000"
            name="purchasePrice"
            endContent={
              <RussianRubleIcon className="h-full w-4 stroke-default-500" />
            }
            hideStepper
          />
          <NumberInput
            value={priceForSale}
            onValueChange={setPriceForSale}
            errorMessage={errors.priceForSale}
            label="Цена продажи"
            placeholder="100,000"
            name="priceForSale"
            endContent={
              <RussianRubleIcon className="h-full w-4 stroke-default-500" />
            }
            hideStepper
          />
        </div>
        <Button
          isLoading={isLoading}
          isDisabled={!!Object.keys(errors).length}
          onPress={onSubmit}
          className="w-fit"
          color="primary"
        >
          Сохранить
        </Button>
      </div>
    </Form>
  );
}

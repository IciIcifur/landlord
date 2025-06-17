'use client';
import { RentalObject } from '@/app/lib/utils/definitions';
import { Form } from '@heroui/form';
import { Input, Textarea } from '@heroui/input';
import { NumberInput } from '@heroui/number-input';
import { useEffect, useState } from 'react';
import CheckFormFields from '@/app/lib/utils/checkFormFields';
import { objectMainFormSchema } from '@/app/lib/utils/zodSchemas';
import { Button } from '@heroui/button';
import objectsStore from '@/app/stores/objectsStore';

export default function ObjectMainForm({ object }: { object: RentalObject }) {
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState<string>(object.name);
  const [address, setAddress] = useState<string>(object.address);
  const [description, setDescription] = useState<string>(
    object.description || '',
  );
  const [square, setSquare] = useState<number>(object.square);

  useEffect(() => {
    setErrors(
      CheckFormFields(
        { name, address, square, description },
        objectMainFormSchema,
      ),
    );
  }, [name, address, square, description, setErrors]);

  const onSubmit = () => {
    setIsLoading(true);
    // TODO: post request
    objectsStore.updateObjectById(object.id, {
      name,
      address,
      square,
      description,
    });
    setIsLoading(false);
  };

  return (
    <Form validationErrors={errors}>
      <div className="flex w-full flex-nowrap justify-between gap-2">
        <div className="flex w-2/3 flex-col gap-2">
          <Input
            isRequired
            value={name}
            onValueChange={setName}
            errorMessage={errors.name}
            label="Название объекта"
            placeholder='Жилой комплекс "Дуб"'
            name="name"
          />
          <NumberInput
            isRequired
            value={square}
            onValueChange={setSquare}
            errorMessage={errors.square}
            label="Площадь объекта (м²)"
            placeholder="85"
            name="square"
            hideStepper
          />
          <NumberInput
            isReadOnly
            value={object.users?.length || 0}
            label="Количество доступов к объекту"
            name="access"
            hideStepper
          />
        </div>
        <div className="flex w-full flex-col items-end gap-2">
          <Input
            isRequired
            value={address}
            onValueChange={setAddress}
            errorMessage={errors.address}
            label="Адрес объекта"
            placeholder="г. Зеленый Город, ул. Зеленая, д. 15, кв. 36"
            name="address"
          />
          <Textarea
            value={description}
            onValueChange={setDescription}
            errorMessage={errors.description}
            label="Описание объекта"
            placeholder="Уютный офис с панорамными окнами в центре города"
            name="description"
            minRows={4}
            maxRows={4}
          />
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
      </div>
    </Form>
  );
}

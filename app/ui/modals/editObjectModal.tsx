import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { useEffect, useState } from 'react';
import { Form } from '@heroui/form';
import CheckFormFields from '@/app/lib/utils/checkFormFields';
import { objectMainFormSchema } from '@/app/lib/utils/zodSchemas';
import { NumberInput } from '@heroui/number-input';
import { RentalObject } from '@/app/lib/utils/definitions';
import objectsStore from '@/app/stores/objectsStore';

export default function EditObjectModal({
  object,
  isOpen,
  onOpenChange,
}: {
  object: RentalObject;
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState<string>(object.name);
  const [address, setAddress] = useState<string>(object.address || '');
  const [square, setSquare] = useState<number>(object.square);

  useEffect(() => {
    setErrors(
      CheckFormFields(
        { name: name, address: address, square: square },
        objectMainFormSchema,
      ),
    );
  }, [name, address, square, setErrors]);

  const onSubmit = () => {
    setIsLoading(true);
    // TODO: post request to server
    objectsStore.updateObjectById(object.id, { name, address, square });
    setIsLoading(false);
    onOpenChange();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>Изменить "{object.name}"</ModalHeader>
        <ModalBody>
          <Form validationErrors={errors}>
            <Input
              isRequired
              value={name}
              onValueChange={setName}
              errorMessage={errors.name}
              label="Название объекта"
              placeholder='Жилой комплекс "Дуб"'
              name="name"
            />
            <Input
              isRequired
              value={address}
              onValueChange={setAddress}
              errorMessage={errors.address}
              label="Адрес объекта"
              placeholder="г. Зеленый Город, ул. Зеленая, д. 15, кв. 36"
              name="address"
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
          </Form>
        </ModalBody>
        <ModalFooter className="flex w-full justify-between gap-2">
          <Button isDisabled={isLoading} size="md" variant="bordered">
            Отмена
          </Button>
          <Button
            onPress={onSubmit}
            isDisabled={!!Object.keys(errors).length}
            isLoading={isLoading}
            size="md"
            color="primary"
            variant="solid"
          >
            Сохранить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

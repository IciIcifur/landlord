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
import objectsStore from '@/app/stores/objectsStore';
import { CreateObject } from '@/app/lib/actions/clientApi';

export default function AddObjectModal({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [square, setSquare] = useState(0);

  useEffect(() => {
    setErrors(
      CheckFormFields(
        { name: name, address: address, square: square },
        objectMainFormSchema,
      ),
    );
  }, [name, address, square, setErrors]);

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const response: any = await CreateObject({
        name,
        address,
        square,
      });
      if (!('errors' in response)) {
        objectsStore.addObject({
          id: response.id,
          name,
          address,
          square,
          users: [],
        });
      } else {
        setErrors(response.errors);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
    onOpenChange();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>Добавить объект аренды</ModalHeader>
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
          <Button
            onPress={onOpenChange}
            isDisabled={isLoading}
            size="md"
            variant="bordered"
          >
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
            Создать
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

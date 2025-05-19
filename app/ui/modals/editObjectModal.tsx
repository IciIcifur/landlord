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
import { EditObjectFormSchema } from '@/app/lib/utils/zodSchemas';
import { NumberInput } from '@heroui/number-input';
import { RussianRubleIcon } from 'lucide-react';

export default function EditObjectModal({
  object,
  isOpen,
  onOpenChange,
}: {
  object: any;
  isOpen: boolean;
  onOpenChange: (change: boolean) => void;
}) {
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState<string>(object.name);
  const [address, setAddress] = useState<string>(object.address || '');
  const [price, setPrice] = useState<number>(object.price);

  useEffect(() => {
    setErrors(
      CheckFormFields(
        { name: name, address: address, price: price },
        EditObjectFormSchema,
      ),
    );
  }, [name, address, price, setErrors]);

  const onSubmit = () => {
    setIsLoading(true);
    // TODO: post request to server
    console.log('Submit!');
    setIsLoading(false);
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
              value={price}
              onValueChange={setPrice}
              errorMessage={errors.price}
              label="Стоимость объекта"
              placeholder="30,000"
              name="price"
              hideStepper
              endContent={
                <RussianRubleIcon className="flex size-4 h-full items-center stroke-default-500" />
              }
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

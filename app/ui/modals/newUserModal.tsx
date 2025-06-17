import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { ReactNode, useEffect, useState } from 'react';
import CheckFormFields from '@/app/lib/utils/checkFormFields';
import { LoginFormSchema } from '@/app/lib/utils/zodSchemas';
import userStore from '@/app/stores/userStore';
import { EyeIcon, EyeIcon as EyeClosedIcon } from 'lucide-react';

export default function NewUserModal({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  const [errors, setErrors] = useState<any>({});
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setErrors(CheckFormFields({ email, password }, LoginFormSchema));
  }, [email, password]);

  const onSubmit = () => {
    setIsLoading(true);
    // TODO: post request to server and get id
    const id = Date.now().toString();
    userStore.addUser(id, email);
    setIsLoading(false);
    onOpenChange();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>Новый пользователь</ModalHeader>
        <ModalBody>
          <Form validationErrors={errors}>
            <Input
              isRequired
              value={email}
              onValueChange={setEmail}
              errorMessage={errors.email}
              label="Адрес эл. почты"
              type="email"
              name="email"
            />
            <Input
              isRequired
              value={password}
              onValueChange={setPassword}
              errorMessage={errors.password}
              label="Пароль"
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              endContent={
                (
                  <Button
                    onPress={() => setPasswordVisible((prev) => !prev)}
                    variant="light"
                    size="sm"
                    isIconOnly
                  >
                    {(passwordVisible && (
                      <EyeClosedIcon className="stroke-default-500" />
                    )) || <EyeIcon className="stroke-default-500" />}
                  </Button>
                ) as ReactNode
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
            Создать
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

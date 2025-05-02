'use client';

import { Input } from '@heroui/input';
import { Form } from '@heroui/form';
import { Button } from '@heroui/button';
import { ReactNode, useEffect, useState } from 'react';
import { EyeClosedIcon, EyeIcon } from 'lucide-react';
import CheckFormFields from '@/app/lib/utils/checkFormFields';
import { LoginFormSchema } from '@/app/lib/utils/zodSchemas';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    setErrors(
      CheckFormFields({ email: email, password: password }, LoginFormSchema),
    );
  }, [email, password, setErrors]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!Object.keys(errors).length) {
      setIsLoading(true);
      // TODO: server request
      // TODO: set user id in cookies and store
      console.log('submit');
      router.push('/');
    }
  };

  return (
    <div className="h-fit w-full">
      <Form
        onSubmit={onSubmit}
        validationErrors={errors}
        className="flex w-full flex-col items-end justify-center gap-4"
      >
        <div className="flex w-full flex-col items-end justify-center gap-2">
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
        </div>
        <Button
          isDisabled={!!Object.keys(errors).length}
          isLoading={isLoading}
          color="primary"
          type="submit"
        >
          Войти
        </Button>
      </Form>
    </div>
  );
}

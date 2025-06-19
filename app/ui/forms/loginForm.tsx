'use client';

import { Input } from '@heroui/input';
import { Form } from '@heroui/form';
import { Button } from '@heroui/button';
import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { EyeIcon as EyeClosedIcon, EyeIcon } from 'lucide-react';
import CheckFormFields from '@/app/lib/utils/checkFormFields';
import { LoginFormSchema } from '@/app/lib/utils/zodSchemas';
import { useRouter } from 'next/navigation';
import { setCookie } from '@/app/lib/actions/handleCookies';
import { User, UserRole } from '@/app/lib/utils/definitions';
import userStore from '@/app/stores/userStore';
import { LoginUser } from '@/app/lib/actions/clientApi';

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

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!Object.keys(errors).length) {
      setIsLoading(true);
      try {
        const response: { id: string; role: UserRole } | { errors: any } =
          await LoginUser({ email, password });
        if (!('errors' in response)) {
          const user: User = { id: response.id, email, role: response.role };
          await setCookie(user.id, user.role);
          userStore.setUser(user);
        } else {
          setErrors(response.errors);
        }
      } catch (e) {
        console.error(e);
      }

      setIsLoading(false);
      if (userStore.user) router.push('/');
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

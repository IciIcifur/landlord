import LoginForm from '@/app/ui/forms/loginForm';
import { Card, CardBody } from '@heroui/card';

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <Card>
        <CardBody className="flex max-w-sm flex-col items-start justify-center gap-4 p-8">
          <h1 className="text-xl font-medium">Войдите, чтобы продолжить</h1>
          <LoginForm />
        </CardBody>
      </Card>
    </div>
  );
}

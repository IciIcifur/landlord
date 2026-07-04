import LoginForm from '@/app/ui/forms/loginForm';
import { Card, CardBody } from '@heroui/card';
import { Alert } from '@heroui/alert';

const MODE = process.env.MODE;
const USERNAME = process.env.SHOWCASE_USERNAME;
const PASSWORD = process.env.SHOWCASE_PASSWORD;

export default function LoginPage() {
  const alertTitle = `Приложение в режиме демонстрации`;
  const alertDescription = `Войдите с логином ${USERNAME} и паролем ${PASSWORD}.`;
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-8">
      <Card>
        <CardBody className="flex w-full max-w-sm flex-col items-start justify-center gap-4 p-8">
          <h1 className="text-xl font-medium">Войдите, чтобы продолжить</h1>
          <LoginForm />
        </CardBody>
      </Card>

      {MODE === 'SHOWCASE' && (
        <Alert
          hideIcon
          color="primary"
          className="max-w-sm flex-grow-0"
          description={alertDescription}
          title={alertTitle}
        />
      )}
    </div>
  );
}

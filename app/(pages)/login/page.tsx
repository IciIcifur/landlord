import LoginForm from '@/app/ui/forms/loginForm';

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="flex max-w-sm flex-col items-start justify-center gap-4 rounded-large border-1 border-default bg-default/10 p-8">
        <h1 className="text-xl font-medium">Войдите, чтобы продолжить</h1>
        <LoginForm />
      </div>
    </div>
  );
}

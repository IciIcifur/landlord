import { Card } from '@heroui/card';
import { InfoIcon } from 'lucide-react';
import { Button } from '@heroui/button';
import Link from 'next/link';

export default function ObjectNotFoundCard() {
  return (
    <Card className="mx-auto h-fit max-w-md p-6">
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <InfoIcon className="size-12 text-default-400" />
        <h2 className="text-xl font-medium">Объект не найден</h2>
        <p className="text-default-500">
          Объект аренды не существует или у вас нет к нему доступа.
        </p>
        <Button as={Link} href="/" color="primary">
          Вернуться на главную
        </Button>
      </div>
    </Card>
  );
}

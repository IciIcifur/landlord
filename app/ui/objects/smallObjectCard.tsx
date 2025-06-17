export default function SmallObjectCard({ object }: { object: any }) {
  return (
    <div className="flex w-full flex-col gap-1">
      <p className="font-medium">{object.name}</p>
      <p className="text-xs text-default-500">
        {object.address || 'Адрес не указан'}
      </p>
    </div>
  );
}

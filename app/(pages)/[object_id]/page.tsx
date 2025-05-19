import ObjectDetail from '@/app/ui/objects/objectDetail';
import GetUserId from '@/app/lib/utils/getUserId';

interface ObjectPageProps {
  object_id: string;
}

async function getObject(objectId?: string) {
  const userId = await GetUserId();

  // TODO: get object by id
  const objects = [
    { id: '1', name: 'Проект 1', price: 5000 },
    { id: '2', name: 'Проект 2', price: 7500 },
    { id: '3', name: 'Проект 3', price: 3200 },
    { id: '4', name: 'Проект 4', price: 9800 },
    { id: '5', name: 'Проект 5', price: 6400 },
  ];

  return objects.find((obj) => obj.id === objectId) || null;
}

export default async function ObjectPage({
  params,
}: {
  params: Promise<ObjectPageProps>;
}) {
  const { object_id } = await params;
  const objectData = await getObject(object_id);

  return <ObjectDetail object={objectData} />;
}

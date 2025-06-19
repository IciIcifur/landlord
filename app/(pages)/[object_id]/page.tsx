import ObjectDetail from '@/app/ui/objects/objectDetail';
import GetUserId from '@/app/lib/utils/getUserId';
import { RentalObject } from '@/app/lib/utils/definitions';
import ObjectLoader from '@/app/loaders/objectLoader';
import { GetObjectById } from '@/app/lib/actions/clientApi';

interface ObjectPageProps {
  object_id: string;
}

async function getObject(objectId: string) {
  const userId = await GetUserId();
  if (userId && objectId) {
    try {
      const response: any = await GetObjectById(userId, objectId);

      if ('errors' in response)
        console.error(
          'Не удалось получить данные об объекте...',
          response.errors,
        );
      else return response as RentalObject;
    } catch (e) {
      console.error('Не удалось получить данные об объекте...');
    }
  }

  return null;
}

export default async function ObjectPage({
  params,
}: {
  params: Promise<ObjectPageProps>;
}) {
  const { object_id } = await params;
  const objectData = await getObject(object_id);

  return (
    <>
      <ObjectLoader object={objectData} />
      <ObjectDetail />
    </>
  );
}

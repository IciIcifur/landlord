import ObjectDetail from '@/app/ui/objects/objectDetail';
import GetUserId from '@/app/lib/utils/getUserId';
import { RentalObject } from '@/app/lib/utils/definitions';
import ObjectLoader from '@/app/loaders/objectLoader';

interface ObjectPageProps {
  object_id: string;
}

async function getObject(objectId?: string) {
  const userId = await GetUserId();

  // TODO: get object by id
  const objects = [
    {
      id: '1',
      name: 'Офис в центре Москвы',
      square: 50,
      address: 'ул. Тверская, д. 7, Москва',
      description: 'Современный офис с ремонтом и парковкой',
      dataForSale: {
        purchasePrice: 1000,
        priceForSale: undefined,
        countOfMonth: undefined,
        profitPerMonth: undefined,
        totalProfit: undefined,
        payback5Year: undefined,
        payback7Year: undefined,
        payback10Year: undefined,
        percentPerYear: undefined,
      },
    },
    {
      id: '2',
      name: 'Склад на юге города',
      square: 75,
      address: 'ул. Южная, д. 15, Санкт-Петербург',
      description: 'Теплый склад с погрузочной зоной',
    },
    {
      id: '3',
      name: 'Коворкинг у метро',
      square: 32,
      address: 'пр-т Ленина, д. 3, Екатеринбург',
      // description отсутствует, поле необязательное
    },
    {
      id: '4',
      name: 'Магазин на первой линии',
      square: 98,
      address: 'ул. Советская, д. 10, Казань',
      description: 'Помещение под торговлю с витринами',
    },
    {
      id: '5',
      name: 'Офис в бизнес-центре',
      square: 64,
      address: 'пр-т Мира, д. 21, Новосибирск',
      description: 'Уютный офис с панорамными окнами',
    },
  ] as RentalObject[];

  return objects.find((obj) => obj.id === objectId) || null;
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
      <ObjectDetail object={objectData} />
    </>
  );
}

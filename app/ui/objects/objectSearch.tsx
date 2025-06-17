import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import objectsStore from '@/app/stores/objectsStore';
import { observer } from 'mobx-react-lite';
import SmallObjectCard from '@/app/ui/objects/smallObjectCard';
import { RentalObject } from '@/app/lib/utils/definitions';
import { Dispatch, SetStateAction } from 'react';

const ObjectSearch = observer(
  ({
    selectedId,
    setSelectedId,
  }: {
    selectedId: string | null;
    setSelectedId: Dispatch<SetStateAction<string>>;
  }) => {
    return (
      <Autocomplete
        selectedKey={selectedId}
        onSelectionChange={(newKey) => setSelectedId(newKey as string)}
        label="Выберите объект"
        placeholder='Жилой комплекс "Дуб"'
        name="object search"
      >
        {objectsStore.allObjects.map(
          (item: RentalObject) =>
            (
              <AutocompleteItem key={item.id} textValue={item.name}>
                <SmallObjectCard object={item} />
              </AutocompleteItem>
            ) as any,
        )}
      </Autocomplete>
    );
  },
);
export default ObjectSearch;

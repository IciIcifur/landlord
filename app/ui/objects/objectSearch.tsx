import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import objectsStore from '@/app/stores/objectsStore';
import { observer } from 'mobx-react-lite';
import SmallObjectCard from '@/app/ui/objects/smallObjectCard';
import { useEffect, useState } from 'react';
import { toJS } from 'mobx';
import { RentalObject } from '@/app/lib/utils/definitions';

const ObjectSearch = observer(
  ({
    selectedId,
    setSelectedId,
  }: {
    selectedId: string | null;
    setSelectedId: (newId: string | null) => void;
  }) => {
    return (
      <Autocomplete
        className="max-w-md"
        items={objectsStore.allObjects}
        selectedKey={selectedId}
        onSelectionChange={(newKey: string) => setSelectedId(newKey)}
        label="Выберите объект"
        placeholder="Жилой комплекс 'Дуб'"
        name="object search"
      >
        {(item: RentalObject) =>
          (
            <AutocompleteItem key={item.id} textValue={item.name}>
              <SmallObjectCard object={item} />
            </AutocompleteItem>
          ) as any
        }
      </Autocomplete>
    );
  },
);
export default ObjectSearch;

import { useEffect, useReducer, useState } from 'react';
import CheckFormFields from '@/app/lib/utils/checkFormFields';
import { recordFormSchema } from '@/app/lib/utils/zodSchemas';
import objectsStore from '@/app/stores/objectsStore';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';
import { Form } from '@heroui/form';
import { NumberInput } from '@heroui/number-input';
import { Button } from '@heroui/button';
import { ObjectRecord } from '@/app/lib/utils/definitions';
import {
  InitialVisibleColumns,
  RecordColumns,
} from '@/app/ui/objects/objectRecordsTable';
import { ChevronDownIcon, RussianRubleIcon } from 'lucide-react';
import { clsx } from 'clsx';

type EditableRecord = Omit<
  ObjectRecord,
  'id' | 'date' | 'totalExpenses' | 'totalIncomes' | 'totalProfit'
>;

type RecordReducerAction = {
  key: keyof EditableRecord;
  value: number | undefined;
};

function recordReducer(
  state: EditableRecord,
  action: RecordReducerAction,
): EditableRecord {
  return {
    ...state,
    [action.key]: action.value,
  };
}

export default function AddRecordModal({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [moreFields, setMoreFields] = useState(false);
  const [newRecord, dispatch] = useReducer(recordReducer, {
    rent: undefined,
    heat: undefined,
    exploitation: undefined,
    mop: undefined,
    renovation: undefined,
    tbo: undefined,
    electricity: undefined,
    earthRent: undefined,
    otherExpenses: undefined,
    otherIncomes: undefined,
    security: undefined,
  });

  useEffect(() => {
    setErrors(CheckFormFields({ ...newRecord }, recordFormSchema));
  }, [newRecord]);

  const onSubmit = () => {
    setIsLoading(true);
    // TODO: post request to server and get id
    objectsStore.addActiveObjectRecord({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...newRecord,
    });
    setIsLoading(false);
    onOpenChange();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="xl"
      className={clsx(
        'origin-top transition-all',
        moreFields ? 'max-h-[1000px] scale-y-100' : 'max-h-fit scale-y-95',
      )}
    >
      <ModalContent>
        <ModalHeader>
          Добавить запись за{' '}
          {new Date().toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </ModalHeader>
        <ModalBody>
          <Button
            className="w-fit"
            size="sm"
            variant="flat"
            color="secondary"
            endContent={
              <ChevronDownIcon
                className={clsx(
                  'w-4 -rotate-90 transition-transform',
                  moreFields && '-rotate-0',
                )}
              />
            }
            onPress={() => setMoreFields(!moreFields)}
          >
            {moreFields ? 'Меньше полей' : 'Больше полей'}
          </Button>
          <Form validationErrors={errors}>
            <div className="flex flex-wrap gap-2">
              {RecordColumns.map((column) => {
                return column.name.startsWith('total') || column.name == 'date'
                  ? null
                  : (!moreFields &&
                        InitialVisibleColumns.union(new Set(['tbo'])).has(
                          column.name,
                        )) ||
                      moreFields
                    ? ((
                        <NumberInput
                          key={column.name}
                          value={newRecord[column.name as keyof EditableRecord]}
                          errorMessage={errors[column.name]}
                          onValueChange={(value) =>
                            dispatch({
                              key: column.name as keyof EditableRecord,
                              value: isNaN(value) ? undefined : value,
                            })
                          }
                          label={column.title}
                          placeholder="8,500"
                          name={column.name}
                          className="w-full sm:w-[49%]"
                          endContent={
                            <RussianRubleIcon className="h-full w-4 stroke-default-500" />
                          }
                          hideStepper
                        />
                      ) as any)
                    : null;
              })}
            </div>
          </Form>
        </ModalBody>
        <ModalFooter className="flex w-full justify-between gap-2">
          <Button isDisabled={isLoading} size="md" variant="bordered">
            Отмена
          </Button>
          <Button
            onPress={onSubmit}
            isDisabled={
              !!Object.keys(errors).length ||
              !Object.values(newRecord).some((value) => value !== undefined)
            }
            isLoading={isLoading}
            size="md"
            color="primary"
            variant="solid"
          >
            Добавить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

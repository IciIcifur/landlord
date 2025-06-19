import { ObjectRecord } from '@/app/lib/utils/definitions';
import {
  SortDescriptor as TableSortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/table';
import { ReactNode, useMemo, useState } from 'react';
import { Pagination } from '@heroui/pagination';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown';
import { Button } from '@heroui/button';
import {
  ChevronDownIcon,
  Columns3Cog,
  PlusIcon,
  TrashIcon,
} from 'lucide-react';
import { useDisclosure } from '@heroui/modal';
import AddRecordModal from '@/app/ui/modals/addRecordModal';
import { observer } from 'mobx-react-lite';
import objectsStore from '@/app/stores/objectsStore';

export const RecordColumns: {
  name: keyof ObjectRecord;
  title: string;
}[] = [
  { name: 'date', title: 'Дата' },
  { name: 'rent', title: 'Аренда' },
  { name: 'heat', title: 'Отопление' },
  { name: 'electricity', title: 'Электричество' },
  { name: 'tbo', title: 'ТБО' },
  { name: 'exploitation', title: 'Эксплуатация' },
  { name: 'mop', title: 'МОП' },
  { name: 'renovation', title: 'Кап. ремонт' },
  { name: 'security', title: 'Охрана' },
  { name: 'earthRent', title: 'Аренда земли' },
  { name: 'otherExpenses', title: 'Другие расходы' },
  { name: 'otherIncomes', title: 'Другие доходы' },
  { name: 'totalExpenses', title: 'Итого расходы' },
  { name: 'totalIncomes', title: 'Итого доходы' },
  { name: 'totalProfit', title: 'Итого прибыль' },
];

export const InitialVisibleColumns = new Set<keyof ObjectRecord>([
  'date',
  'rent',
  'heat',
  'renovation',
  'electricity',
  'security',
  'totalProfit',
]);

type SortDescriptor = {
  column: keyof ObjectRecord;
  direction: 'ascending' | 'descending';
};

const ObjectRecordsTable = observer(() => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(
    new Set(),
  );

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'date',
    direction: 'descending',
  });
  const rowsPerPage = 9;
  const records = objectsStore.activeObject?.records || [];
  const pages = Math.ceil(records.length / rowsPerPage);
  const [page, setPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState(
    RecordColumns.filter((column) => InitialVisibleColumns.has(column.name)),
  );

  const sortedRecords = useMemo(
    () => sortRecords(records, sortDescriptor),
    [records, sortDescriptor],
  );

  const sortedPaginatedRecords = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedRecords.slice(start, end);
  }, [page, sortedRecords]);

  function sortRecords(
    records: ObjectRecord[],
    tempSortDescriptor: SortDescriptor,
  ): ObjectRecord[] {
    if (!tempSortDescriptor) return records;
    const { column, direction } = tempSortDescriptor;
    return [...records].sort((a, b) => {
      let cmp = 0;
      if (column === 'date') {
        cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        const first = typeof a[column] === 'number' ? (a[column] as number) : 0;
        const second =
          typeof b[column] === 'number' ? (b[column] as number) : 0;
        cmp = first - second;
      }
      return direction === 'descending' ? -cmp : cmp;
    });
  }

  function calculateCell(
    column: keyof Omit<ObjectRecord, 'id' | 'date'>,
    item: ObjectRecord,
  ): number {
    const val = (field: keyof ObjectRecord) => (item[field] ?? 0) as number;

    switch (column) {
      case 'totalExpenses':
        return (
          val('heat') +
          val('exploitation') +
          val('mop') +
          val('renovation') +
          val('tbo') +
          val('electricity') +
          val('earthRent') +
          val('security') +
          val('otherExpenses')
        );
      case 'totalIncomes':
        return val('rent') + val('otherIncomes');
      case 'totalProfit':
        return (
          val('rent') +
          val('otherIncomes') -
          (val('heat') +
            val('exploitation') +
            val('mop') +
            val('renovation') +
            val('tbo') +
            val('electricity') +
            val('earthRent') +
            val('security') +
            val('otherExpenses'))
        );
      default:
        return val(column as keyof ObjectRecord);
    }
  }

  const formatNumber = (n: number = 0): string =>
    new Intl.NumberFormat('en-EN', { useGrouping: true }).format(n);

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleDeleteRecords = () => {
    // TODO: delete request
    objectsStore.deleteActiveObjectRecord(selectedRecords);
    setSelectedRecords(new Set());
  };

  return (
    <>
      <Table
        classNames={{
          base: 'max-w-6xl',
        }}
        aria-label="records-table"
        color="danger"
        sortDescriptor={sortDescriptor}
        onSortChange={(desc: TableSortDescriptor) => {
          setSortDescriptor({
            column: desc.column as keyof ObjectRecord,
            direction: desc.direction as 'ascending' | 'descending',
          });
        }}
        selectionMode="multiple"
        showSelectionCheckboxes={true}
        selectedKeys={selectedRecords}
        onSelectionChange={(keys) => setSelectedRecords(keys as Set<string>)}
        topContent={
          (
            <div className="flex w-full justify-end gap-2">
              {selectedRecords.size > 0 && (
                <Button
                  onPress={handleDeleteRecords}
                  isIconOnly
                  color="danger"
                  size="sm"
                >
                  <TrashIcon className="w-4" />
                </Button>
              )}
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    startContent={
                      <Columns3Cog className="w-4 stroke-default-500" />
                    }
                    endContent={<ChevronDownIcon className="w-4" />}
                    size="sm"
                    variant="flat"
                    className="font-medium"
                  >
                    Столбцы
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Table Columns"
                  closeOnSelect={false}
                  selectedKeys={visibleColumns.map((column) => column.name)}
                  selectionMode="multiple"
                  onSelectionChange={(keys) =>
                    setVisibleColumns(
                      RecordColumns.filter((column) =>
                        (keys as Set<keyof ObjectRecord>).has(column.name),
                      ),
                    )
                  }
                >
                  {RecordColumns.map(
                    (column) =>
                      (
                        <DropdownItem key={column.name}>
                          {column.title}
                        </DropdownItem>
                      ) as any,
                  )}
                </DropdownMenu>
              </Dropdown>
              <Button
                onPress={onOpen}
                startContent={<PlusIcon className="w-4" />}
                color="primary"
                size="sm"
              >
                Добавить запись
              </Button>
            </div>
          ) as ReactNode
        }
        bottomContent={
          (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          ) as ReactNode
        }
      >
        <TableHeader>
          {visibleColumns.map(
            (column) =>
              (
                <TableColumn key={column.name} allowsSorting={true}>
                  {column.title}
                </TableColumn>
              ) as any,
          )}
        </TableHeader>
        <TableBody
          emptyContent={'Пока нет записей'}
          items={sortedPaginatedRecords}
        >
          {(item: ObjectRecord) =>
            (
              <TableRow key={item.id}>
                {(columnKey) => {
                  if (columnKey === 'id') return null;
                  if (columnKey === 'date') {
                    return (
                      <TableCell>
                        <p className="text-nowrap p-0.5 text-xs">
                          {formatDate(item[columnKey])}
                        </p>
                      </TableCell>
                    ) as any;
                  }
                  const value = columnKey.toString().startsWith('total')
                    ? calculateCell(
                        columnKey as keyof Omit<ObjectRecord, 'id' | 'date'>,
                        item,
                      )
                    : (item[columnKey as keyof ObjectRecord] ?? '-');
                  return (
                    <TableCell>
                      <p className="text-nowrap p-0.5 text-xs">
                        {typeof value === 'number'
                          ? formatNumber(value)
                          : value}
                      </p>
                    </TableCell>
                  );
                }}
              </TableRow>
            ) as any
          }
        </TableBody>
      </Table>
      {isOpen && <AddRecordModal isOpen={isOpen} onOpenChange={onOpenChange} />}
    </>
  );
});

export default ObjectRecordsTable;

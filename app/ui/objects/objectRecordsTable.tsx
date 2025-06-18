import { ObjectRecord } from '@/app/lib/utils/definitions';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/table';
import { ReactNode, useMemo, useState } from 'react';
import { mockObjectRecords } from '@/app/lib/utils/generateMockRecords';
import { Pagination } from '@heroui/pagination';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown';
import { Button } from '@heroui/button';
import { ChevronDownIcon, Columns3Cog } from 'lucide-react';

export default function ObjectRecordsTable({
  records,
}: {
  records: ObjectRecord[];
}) {
  const columns: {
    name: keyof ObjectRecord;
    title: string;
    sortable: boolean;
  }[] = [
    { name: 'date', title: 'Дата', sortable: true },
    { name: 'rent', title: 'Аренда', sortable: true },
    { name: 'heat', title: 'Отопление', sortable: true },
    { name: 'electricity', title: 'Электричество', sortable: true },
    { name: 'tbo', title: 'ТБО', sortable: true },
    { name: 'exploitation', title: 'Эксплуатация', sortable: true },
    { name: 'mop', title: 'МОП', sortable: true },
    { name: 'renovation', title: 'Кап. ремонт', sortable: true },
    { name: 'security', title: 'Охрана', sortable: true },
    { name: 'earthRent', title: 'Аренда земли', sortable: true },
    { name: 'otherExpenses', title: 'Другие расходы', sortable: true },
    { name: 'otherIncomes', title: 'Другие доходы', sortable: true },
    { name: 'totalExpenses', title: 'Итого расходы', sortable: true },
    { name: 'totalIncomes', title: 'Итого доходы', sortable: true },
    { name: 'totalProfit', title: 'Итого прибыль', sortable: true },
  ];
  const initialVisibleColumns = new Set<keyof ObjectRecord>([
    'date',
    'rent',
    'heat',
    'renovation',
    'electricity',
    'security',
    'totalProfit',
  ]);
  const [sortDescriptor, setSortDescriptor] = useState<
    | {
        column: any;
        direction: 'ascending' | 'descending';
      }
    | undefined
  >(undefined);
  const rowsPerPage = 9;
  // TODO: replace mock data with real records
  const pages = Math.ceil(mockObjectRecords.length / rowsPerPage);
  const [page, setPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState(
    columns.filter((column) => initialVisibleColumns.has(column.name)),
  );

  const sortedRecords = sortRecords(mockObjectRecords, sortDescriptor);
  const sortedPaginatedRecords = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedRecords.slice(start, end);
  }, [page, sortedRecords]);

  function sortRecords(
    records: ObjectRecord[],
    sortDescriptor: typeof sortDescriptor,
  ): ObjectRecord[] {
    if (!sortDescriptor) return records;
    const { column, direction } = sortDescriptor;
    return [...records].sort((a, b) => {
      const first = a[column];
      const second = b[column];

      let cmp = 0;
      if (column === 'date') {
        cmp =
          new Date(first as string).getTime() -
          new Date(second as string).getTime();
      } else {
        cmp = first - second;
      }
      return direction === 'descending' ? -cmp : cmp;
    });
  }

  function calculateCell(column: keyof ObjectRecord, item: ObjectRecord) {
    switch (column) {
      case 'totalExpenses':
        return (
          item['heat'] +
          item['exploitation'] +
          item['mop'] +
          item['renovation'] +
          item['tbo'] +
          item['electricity'] +
          item['earthRent'] +
          item['security'] +
          item['otherExpenses']
        );
      case 'totalIncomes':
        return item['rent'] + item['otherIncomes'];
      case 'totalProfit':
        return (
          item['rent'] +
          item['otherIncomes'] -
          (item['heat'] +
            item['exploitation'] +
            item['mop'] +
            item['renovation'] +
            item['tbo'] +
            item['electricity'] +
            item['earthRent'] +
            item['security'] +
            item['otherExpenses'])
        );
      default:
        return item[column];
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

  return (
    <Table
      classNames={{
        base: 'max-w-6xl',
      }}
      aria-label="records-table"
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
      selectionMode="single"
      topContent={
        (
          <div className="flex w-full justify-end">
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
                    columns.filter((column) =>
                      (keys as Set<keyof ObjectRecord>).has(column.name),
                    ),
                  )
                }
              >
                {columns.map(
                  (column) =>
                    (
                      <DropdownItem key={column.name}>
                        {column.title}
                      </DropdownItem>
                    ) as any,
                )}
              </DropdownMenu>
            </Dropdown>
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
      <TableHeader columns={visibleColumns}>
        {(column) =>
          (
            <TableColumn key={column.name} allowsSorting={column.sortable}>
              {column.title}
            </TableColumn>
          ) as any
        }
      </TableHeader>
      <TableBody
        emptyContent={'Пока нет записей'}
        items={sortedPaginatedRecords}
      >
        {(item: ObjectRecord) =>
          (
            <TableRow key={item.id}>
              {(columnKey) =>
                (
                  <TableCell>
                    <p className="text-nowrap p-0.5 text-xs">
                      {columnKey === 'date'
                        ? formatDate(item[columnKey])
                        : formatNumber(
                            calculateCell(
                              columnKey as keyof ObjectRecord,
                              item,
                            ) | 0,
                          )}
                    </p>
                  </TableCell>
                ) as any
              }
            </TableRow>
          ) as any
        }
      </TableBody>
    </Table>
  );
}

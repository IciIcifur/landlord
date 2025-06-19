'use client';

import { DataForSale } from '@/app/lib/utils/definitions';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/table';
import { PercentIcon, RussianRubleIcon } from 'lucide-react';

export default function DataForSaleTable({
  dataForSale,
}: {
  dataForSale: DataForSale;
}) {
  const formatNumber = (n: number = 0): string =>
    new Intl.NumberFormat('en-EN', { useGrouping: true }).format(n);

  return (
    <Table removeWrapper aria-label="data-for-sale-table">
      <TableHeader>
        <TableColumn>Кол-во мес.</TableColumn>
        <TableColumn>Ср. мес. прибыль</TableColumn>
        <TableColumn>Прибыль за 12 мес.</TableColumn>
        <TableColumn>Окупаемость 5 лет</TableColumn>
        <TableColumn>Окупаемость 7 лет</TableColumn>
        <TableColumn>Окупаемость 10 лет</TableColumn>
        <TableColumn>% / год</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>{dataForSale.countOfMonth}</TableCell>
          <TableCell>
            <div className="flex w-full justify-between">
              {formatNumber(dataForSale.profitPerMonth)}
              <RussianRubleIcon className="h-full w-4 stroke-default-500" />
            </div>
          </TableCell>
          <TableCell>
            <div className="flex w-full justify-between">
              {formatNumber(dataForSale.totalProfit)}
              <RussianRubleIcon className="h-full w-4 stroke-default-500" />
            </div>
          </TableCell>
          <TableCell>
            <div className="flex w-full justify-between">
              {formatNumber(dataForSale.payback5Year)}
              <RussianRubleIcon className="h-full w-4 stroke-default-500" />
            </div>
          </TableCell>
          <TableCell>
            <div className="flex w-full justify-between">
              {formatNumber(dataForSale.payback7Year)}
              <RussianRubleIcon className="h-full w-4 stroke-default-500" />
            </div>
          </TableCell>
          <TableCell>
            <div className="flex w-full justify-between">
              {formatNumber(dataForSale.payback10Year)}
              <RussianRubleIcon className="h-full w-4 stroke-default-500" />
            </div>
          </TableCell>
          <TableCell>
            <div className="flex w-full justify-between">
              {dataForSale.percentPerYear}
              <PercentIcon className="h-full w-4 stroke-default-500" />
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

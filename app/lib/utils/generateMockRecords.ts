// Генерация 50 записей с рандомными значениями за последние 50 месяцев
import { ObjectRecord } from '@/app/lib/utils/definitions';

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min: number, max: number, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function getPastDate(monthsAgo: number): string {
  const now = new Date();
  now.setMonth(now.getMonth() - monthsAgo);
  now.setDate(getRandomInt(1, 28));
  return now.toISOString().split('T')[0];
}

export const mockObjectRecords: ObjectRecord[] = Array.from(
  { length: 50 },
  (_, i) => {
    const monthsAgo = 50 - i - 1;
    const rent = getRandomInt(8000, 20000);
    const heat = getRandomInt(1000, 4000);
    const exploitation = getRandomInt(300, 1500);
    const mop = getRandomInt(200, 900);
    const renovation = getRandomInt(0, 3500);
    const tbo = getRandomInt(100, 800);
    const electricity = getRandomInt(200, 2000);
    const earthRent = getRandomInt(0, 1200);
    const otherExpenses = getRandomInt(0, 1500);
    const otherIncomes = getRandomInt(0, 2000);
    const security = getRandomInt(0, 1600);

    const totalExpenses =
      heat +
      exploitation +
      mop +
      renovation +
      tbo +
      electricity +
      earthRent +
      otherExpenses +
      security;
    const totalIncomes = rent + otherIncomes;
    const totalProfit = totalIncomes - totalExpenses;

    return {
      id: `rec-${i + 1}`,
      date: getPastDate(monthsAgo),
      rent,
      heat,
      exploitation,
      mop,
      renovation,
      tbo,
      electricity,
      earthRent,
      otherExpenses,
      otherIncomes,
      security,
      totalExpenses,
      totalIncomes,
      totalProfit,
    };
  },
);

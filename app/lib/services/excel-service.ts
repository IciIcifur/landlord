export interface ExcelExportResult {
  buffer: Buffer;
  filename: string;
  mimeType: string;
}

export function generateExcelFile(records: any[], objectName: string): ExcelExportResult {
  const BOM = "\uFEFF";

  const headers = [
    "Месяц",
    "Аренда",
    "Тепло",
    "Эксплуатация",
    "МОП",
    "Капремонт",
    "ТБО",
    "Электричество",
    "Аренда земли",
    "Прочие расходы",
    "Прочие доходы",
    "Охрана",
    "Итого расходы",
    "Итого доходы",
    "Итого прибыль",
  ];

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("ru-RU", {
      month: "long",
      year: "numeric",
    });
  };

  const calculateTotals = (record: any) => {
    const totalExpenses =
      (record.heat || 0) +
      (record.exploitation || 0) +
      (record.mop || 0) +
      (record.renovation || 0) +
      (record.tbo || 0) +
      (record.electricity || 0) +
      (record.earthRent || 0) +
      (record.otherExpenses || 0) +
      (record.security || 0);

    const totalIncomes = (record.rent || 0) + (record.otherIncomes || 0);
    const totalProfit = totalIncomes - totalExpenses;

    return { totalExpenses, totalIncomes, totalProfit };
  };

  const calculateSummaryRow = (records: any[]): (string | number)[] => {
    const totals = records.reduce(
      (acc, record) => {
        acc.rent += record.rent || 0;
        acc.heat += record.heat || 0;
        acc.exploitation += record.exploitation || 0;
        acc.mop += record.mop || 0;
        acc.renovation += record.renovation || 0;
        acc.tbo += record.tbo || 0;
        acc.electricity += record.electricity || 0;
        acc.earthRent += record.earthRent || 0;
        acc.otherExpenses += record.otherExpenses || 0;
        acc.otherIncomes += record.otherIncomes || 0;
        acc.security += record.security || 0;
        return acc;
      },
      {
        rent: 0,
        heat: 0,
        exploitation: 0,
        mop: 0,
        renovation: 0,
        tbo: 0,
        electricity: 0,
        earthRent: 0,
        otherExpenses: 0,
        otherIncomes: 0,
        security: 0,
      }
    );

    const totalExpenses =
      totals.heat +
      totals.exploitation +
      totals.mop +
      totals.renovation +
      totals.tbo +
      totals.electricity +
      totals.earthRent +
      totals.otherExpenses +
      totals.security;

    const totalIncomes = totals.rent + totals.otherIncomes;
    const totalProfit = totalIncomes - totalExpenses;

    return [
      totals.rent,
      totals.heat,
      totals.exploitation,
      totals.mop,
      totals.renovation,
      totals.tbo,
      totals.electricity,
      totals.earthRent,
      totals.otherExpenses,
      totals.otherIncomes,
      totals.security,
      totalExpenses,
      totalIncomes,
      totalProfit,
    ];
  };

  const rows = records.map((record) => {
    const totals = calculateTotals(record);

    return [
      formatDate(record.date),
      record.rent || 0,
      record.heat || 0,
      record.exploitation || 0,
      record.mop || 0,
      record.renovation || 0,
      record.tbo || 0,
      record.electricity || 0,
      record.earthRent || 0,
      record.otherExpenses || 0,
      record.otherIncomes || 0,
      record.security || 0,
      totals.totalExpenses,
      totals.totalIncomes,
      totals.totalProfit,
    ];
  });

  let csvContent = BOM;
  csvContent += headers.join(";") + "\n";

  rows.forEach((row) => {
    csvContent += row.join(";") + "\n";
  });

  if (rows.length > 0) {
    const totalRow = calculateSummaryRow(records);
    csvContent += "ИТОГО;" + totalRow.join(";") + "\n";
  }

  const buffer = Buffer.from(csvContent, "utf8");

  return {
    buffer,
    filename: `${objectName || "export"}.csv`,
    mimeType: "text/csv; charset=utf-8",
  };
}

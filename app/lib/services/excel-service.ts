export interface ExcelExportResult {
  buffer: Buffer;
  filename: string;
  mimeType: string;
}

export function generateExcelFile(
  records: any[],
  objectName: string,
): ExcelExportResult {
  // TODO: Реализовать генерацию CSV-файла на основе переданных записей
  const csvData = 'id,note\n1,"Заглушка данных"';
  const bom = Buffer.from('\uFEFF', 'utf8');
  const csvBuffer = Buffer.concat([bom, Buffer.from(csvData, 'utf8')]);

  return {
    buffer: csvBuffer,
    filename: `stub.csv`,
    mimeType: 'text/csv; charset=utf-8',
  };
}

import { ObjectService } from '@/app/lib/telegram/services/objectService';
import {
  generateExcelFile,
  ExcelExportResult,
} from '@/app/lib/services/excel-service';
import archiver from 'archiver';
import streamToPromise from 'stream-to-promise';

export class ExcelService {
  private objectService: ObjectService;

  constructor(objectService: ObjectService) {
    this.objectService = objectService;
  }

  async generateObjectReport(
    objectId: string,
    userId: string,
    userRole: string,
  ): Promise<ExcelExportResult> {
    try {
      const objectResponse = await this.objectService.getObjectById(
        objectId,
        userId,
        userRole,
      );

      if (!objectResponse.success || !objectResponse.object) {
        throw new Error(
          objectResponse.error?.message ||
            'Объект не найден или доступ запрещен',
        );
      }

      const records = await this.objectService.getRecordsByObjectId(
        objectId,
      );

      if (records.length === 0) {
        throw new Error('Нет данных для формирования отчета');
      }

      return generateExcelFile(records, objectResponse.object.name);
    } catch (error) {
      console.error('Error generating object report:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Не удалось сгенерировать отчет по объекту',
      );
    }
  }

  async generateAllObjectsReport(
    userId: string,
    userRole: string,
  ): Promise<ExcelExportResult> {
    try {
      const objects = await this.objectService.getUserObjects(userId, userRole);

      if (!objects || objects.length === 0) {
        throw new Error('Нет доступных объектов для экспорта');
      }

      const archive = archiver('zip', { zlib: { level: 9 } });
      const buffers: Buffer[] = [];

      archive.on('data', (data: Buffer) => buffers.push(data));

      let processedObjects = 0;
      for (const object of objects) {
        try {
          const records = await this.objectService.getRecordsByObjectId(
            object.id,
          );
          if (records.length > 0) {
            const excelFile = generateExcelFile(records, object.name);
            archive.append(excelFile.buffer, {
              name: `${object.name}_id_${object.id}.csv`,
            });
            processedObjects++;
          }
        } catch (error) {
          console.error(`Error processing object ${object.id}:`, error);
        }
      }

      if (processedObjects === 0) {
        throw new Error('Не найдено ни одного объекта с данными для экспорта');
      }

      archive.finalize();
      await streamToPromise(archive);

      return {
        buffer: Buffer.concat(buffers),
        filename: `objects_report_${new Date().toISOString().slice(0, 10)}.zip`,
        mimeType: 'application/zip',
      };
    } catch (error) {
      console.error('Error generating all objects report:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Не удалось сгенерировать отчет по всем объектам',
      );
    }
  }
}

import { Readable } from 'stream';
import csv from 'csv-parser';

export const processCsv = async <T>(source: Readable): Promise<T[]> => {
  const items: T[] = [];
  return new Promise((resolve, reject) => {
    source
      .pipe(csv({ separator: ';' }))
      .on('data', (data: T) => {
        items.push(data);
      })
      .on('end', () => {
        resolve(items);
      })
      .on('error', reject);
  });
};

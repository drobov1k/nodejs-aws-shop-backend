import { Readable } from 'stream';
import csv from 'csv-parser';

export const processCsv = <T, K extends (arg: T) => void>(source: Readable, action: K): void => {
  source.pipe(csv({ separator: ';' })).on('data', (data: T) => {
    action(data);
  });
};

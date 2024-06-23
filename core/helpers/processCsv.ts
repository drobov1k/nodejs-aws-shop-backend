import { Readable } from 'stream';
import csv from 'csv-parser';
import { logger } from './logger';

export const processCsv = <T>(source: Readable): void => {
  source.pipe(csv({ separator: ';' })).on('data', (data: T) => {
    logger.log(data);
  });
};

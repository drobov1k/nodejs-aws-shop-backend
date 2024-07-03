import { S3Event, Context } from 'aws-lambda';
import { logger, processCsv } from '@core/helpers';
import { s3Client } from '@core/infra/s3';
import { ProductWithStock } from '@core/domain/product';
import Config from '../../../config';

export const importFileParser = async (event: S3Event, _ctx?: Context): Promise<void> => {
  try {
    for (const record of event.Records) {
      const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
      const found = await s3Client.getObject(Config.S3_BUCKET_NAME, key);

      if (!found) {
        throw new Error("Can't find the file: bucket " + Config.S3_BUCKET_NAME + ', file ' + key);
      }

      processCsv<ProductWithStock, typeof logger.log>(found, logger.log);
      await s3Client.moveObject({
        sourceBucket: Config.S3_BUCKET_NAME,
        sourceKey: key,
        destinationKey: `parsed/${key.split('/')[1]}`,
      });
    }
  } catch (e) {
    logger.error(e);
  }
};

import { Context, SQSEvent } from 'aws-lambda';
import { ProductWithStock } from '@core/domain/product';
import { logger } from '@core/helpers';
import { productRepository } from '@core/repositories';
import { sendSuccessCreationEmail } from './utils/sendSuccessCreationEmail';

export const catalogBatchProcess = async (event: SQSEvent, _context?: Context): Promise<void> => {
  try {
    const products: ProductWithStock[] = [];

    for (const { body } of event.Records) {
      products.push(JSON.parse(body));
    }

    await productRepository.insertWithStocks(products);
    await sendSuccessCreationEmail(products);
  } catch (e) {
    logger.error(e);
  }
};

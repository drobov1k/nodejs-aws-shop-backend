import { sqsClient } from '@core/infra/sqs';
import { ProductWithStock } from '@core/domain/product';
import Config from '../../../../config';

export const sendProductMessages = async (products: ProductWithStock[]): Promise<void> => {
  await sqsClient.sendMessageBatch(
    Config.PRODUCT_SQS_QUEUE_URL,
    products.map((product) =>
      JSON.stringify(
        Object.keys(product).reduce((acc, el) => {
          acc[el.toLowerCase()] = product[el];
          return acc;
        }, {}),
      ),
    ),
  );
};

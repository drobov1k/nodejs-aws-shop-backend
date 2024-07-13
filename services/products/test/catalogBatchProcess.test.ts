import { SQSEvent } from 'aws-lambda';
import { productRepository } from '@core/repositories';
import { snsClient } from '@core/infra/sns';
import { catalogBatchProcess } from '../functions/catalogBatchProcess';
import { buildMessage } from '../functions/utils/sendSuccessCreationEmail';
import Config from '../../../config';
import { mockProducts } from './mocks';

jest.mock('@core/repositories', () => ({
  productRepository: {
    insertWithStocks: jest.fn(),
  },
}));

jest.mock('@core/infra/sns', () => ({
  snsClient: {
    publish: jest.fn(),
  },
}));

describe('SQS event: messages are received', () => {
  it('should process catalog', async () => {
    const event: SQSEvent = {
      Records: mockProducts.map((product) => ({
        body: JSON.stringify(product),
      })),
    } as any;
    await catalogBatchProcess(event);

    expect(productRepository.insertWithStocks).toHaveBeenCalledWith(mockProducts);
    expect(snsClient.publish).toHaveBeenCalledWith(Config.PRODUCT_SNS_TOPIC_ARN, buildMessage(mockProducts), {
      MessageAttributes: {
        price: {
          DataType: 'Number',
          StringValue: String(Math.max(...mockProducts.map((p) => p.price))),
        },
      },
    });
  });
});

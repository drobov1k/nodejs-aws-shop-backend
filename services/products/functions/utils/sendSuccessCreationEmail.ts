import { snsClient } from '@core/infra/sns';
import { ProductWithStock } from '@core/domain/product';
import Config from '../../../../config';

export const buildMessage = (products: ProductWithStock[]): string => `
  The following products were imported:
  ${products.map(
    (product, i) => `
    ${i + 1}. ${JSON.stringify(product)}
  `,
  )}
`;

export const sendSuccessCreationEmail = async (products: ProductWithStock[]): Promise<void> => {
  const maxPrice = Math.max(...products.map((p) => p.price));

  await snsClient.publish(Config.PRODUCT_SNS_TOPIC_ARN, buildMessage(products), {
    MessageAttributes: {
      price: {
        DataType: 'Number',
        StringValue: maxPrice.toString(),
      },
    },
  });
};

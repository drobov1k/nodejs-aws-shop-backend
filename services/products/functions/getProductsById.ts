import HttpStatus from 'http-status';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { productRepository } from '@core/repositories';
import { errorHandler } from '@core/helpers';

export const getProductsById = errorHandler(
  async ({ pathParameters }: APIGatewayProxyEvent, _ctx?: Context): Promise<APIGatewayProxyResult> => {
    const productId = pathParameters.id;
    const product = await productRepository.findOne(productId);

    if (!product) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        body: JSON.stringify({
          message: `Product ${productId} not found`,
        }),
      };
    }

    return {
      statusCode: HttpStatus.OK,
      body: JSON.stringify(product),
    };
  },
);

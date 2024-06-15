import HttpStatus from 'http-status';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ProductService } from '@core/services/productService';
import { ProductRepository } from '@core/repositories/productRepository';
import { withCors } from '@core/utils/withCors';
import products from '../mocks/products';
import config from '../config';

const productService = new ProductService(new ProductRepository(products));

export const getProductsById = withCors(
  async ({ pathParameters }: APIGatewayProxyEvent, _ctx?: Context): Promise<APIGatewayProxyResult> => {
    const productId = pathParameters.id;
    const product = await productService.getById(productId);

    if (!product) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        body: JSON.stringify({
          message: `Product ${productId} not found.`,
        }),
      };
    }

    return {
      statusCode: HttpStatus.OK,
      body: JSON.stringify(product),
    };
  },
  config.UI_URL,
);

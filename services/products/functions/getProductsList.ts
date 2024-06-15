import HttpStatus from 'http-status';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ProductService } from '../../../core/services/productService';
import { ProductRepository } from '../../../core/repositories/productRepository';
import { withCors } from '../../../core/utils/withCors';
import config from '../config';
import products from '../mocks/products';

const productService = new ProductService(new ProductRepository(products));

export const getProductsList = withCors(
  async (_event: APIGatewayProxyEvent, _ctx?: Context): Promise<APIGatewayProxyResult> => {
    const products = await productService.getAll();

    return {
      statusCode: HttpStatus.OK,
      body: JSON.stringify(products),
    };
  },
  config.UI_URL,
);

import HttpStatus from 'http-status';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ProductService } from '@core/services/productService';
import { withCors } from '@core/helpers/withCors';
import config from '../config';

export const getProductsList = withCors(
  async (_event: APIGatewayProxyEvent, _ctx?: Context): Promise<APIGatewayProxyResult> => {
    const products = await new ProductService().getAll();

    return {
      statusCode: HttpStatus.OK,
      body: JSON.stringify(products),
    };
  },
  config.UI_URL,
);

import HttpStatus from 'http-status';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { productService } from '@core/services';
import { withCors } from '@core/helpers/withCors';

export const getProductsList = withCors(
  async (_event: APIGatewayProxyEvent, _ctx?: Context): Promise<APIGatewayProxyResult> => {
    const products = await productService.getAll();

    return {
      statusCode: HttpStatus.OK,
      body: JSON.stringify(products),
    };
  }
);

import HttpStatus from 'http-status';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { productRepository } from '@core/repositories';
import { withCors } from '@core/helpers/withCors';

export const getProductsList = withCors(
  async (_event: APIGatewayProxyEvent, _ctx?: Context): Promise<APIGatewayProxyResult> => {
    const products = await productRepository.findAll();

    return {
      statusCode: HttpStatus.OK,
      body: JSON.stringify(products),
    };
  },
);

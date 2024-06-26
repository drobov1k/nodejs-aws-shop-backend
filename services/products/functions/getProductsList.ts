import HttpStatus from 'http-status';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { productRepository } from '@core/repositories';
import { errorHandler } from '@core/helpers';

export const getProductsList = errorHandler(
  async (_event: APIGatewayProxyEvent, _ctx?: Context): Promise<APIGatewayProxyResult> => ({
    statusCode: HttpStatus.OK,
    body: JSON.stringify(await productRepository.findAllWithStocks()),
  }),
);

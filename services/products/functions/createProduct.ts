import HttpStatus from 'http-status';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { productRepository } from '@core/repositories';
import { errorHandler } from '@core/helpers';
import { validateCreateProductBody } from './validators/validateCreateProductBody';

export const createProduct = errorHandler(
  async ({ body }: APIGatewayProxyEvent, _ctx?: Context): Promise<APIGatewayProxyResult> => {
    const validationMessage = validateCreateProductBody(body);

    if (validationMessage) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        body: JSON.stringify({
          message: validationMessage,
        }),
      };
    }

    return {
      statusCode: HttpStatus.CREATED,
      body: JSON.stringify(await productRepository.create(JSON.parse(body))),
    };
  },
);

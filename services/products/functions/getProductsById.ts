import HttpStatus from 'http-status';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { productService } from '@core/services';
import { withCors } from '@core/helpers/withCors';

export const getProductsById = withCors(
  async ({ pathParameters }: APIGatewayProxyEvent, _ctx?: Context): Promise<APIGatewayProxyResult> => {
    const productId = pathParameters.id;
    const product = await productService.getOne(productId);

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
  }
);

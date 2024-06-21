import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import HttpStatus from 'http-status';
import { withCors } from './withCors';

type LambdaFunction = (event: APIGatewayProxyEvent, context?: Context) => Promise<APIGatewayProxyResult>;

export function errorHandler(fn: LambdaFunction): LambdaFunction {
  return async (event, context) => {
    let result: APIGatewayProxyResult;

    try {
      result = await withCors(fn)(event, context);
    } catch (e) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        body: `Internal server error - ${JSON.stringify(e)}`,
      };
    }

    return result;
  };
}

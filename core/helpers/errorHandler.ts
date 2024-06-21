import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import HttpStatus from 'http-status';
import { withCors } from './withCors';
import { logger, logRequest } from './logger';

type LambdaFunction = (event: APIGatewayProxyEvent, context?: Context) => Promise<APIGatewayProxyResult>;

export function errorHandler(fn: LambdaFunction): LambdaFunction {
  return async (event, context) => {
    let result: APIGatewayProxyResult;

    try {
      logRequest(event);
      result = await withCors(fn)(event, context);
    } catch (e) {
      logger.error(e);

      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        body: `Internal server error - ${JSON.stringify(e)}`,
      };
    }

    return result;
  };
}

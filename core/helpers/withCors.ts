import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import Config from '../../config';

type LambdaFunction = (event: APIGatewayProxyEvent, context?: Context) => Promise<APIGatewayProxyResult>;

export enum HttpMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Patch = 'PATCH',
  Delete = 'DELETE',
  Options = 'OPTIONS',
}

export function withCors(fn: LambdaFunction): LambdaFunction {
  return async (event, context) => {
    const result = await fn(event, context);

    return {
      ...result,
      headers: {
        ...result.headers,
        'Access-Control-Allow-Origin': Config.UI_URL,
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': event.httpMethod,
      },
    };
  };
}

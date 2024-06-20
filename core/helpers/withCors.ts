import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import Config from '../../config';

type LambdaFunction = (event: APIGatewayProxyEvent, context?: Context) => Promise<APIGatewayProxyResult>;

export function withCors(fn: LambdaFunction): LambdaFunction {
  return async (event, context) => {
    const result = await fn(event, context);

    return {
      ...result,
      headers: {
        ...result.headers,
        'Access-Control-Allow-Origin': Config.UI_URL,
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET',
      },
    };
  };
}

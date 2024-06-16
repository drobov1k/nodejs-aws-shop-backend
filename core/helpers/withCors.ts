import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

type LambdaFunction = (event: APIGatewayProxyEvent, context?: Context) => Promise<APIGatewayProxyResult>;

export function withCors(fn: LambdaFunction, origins: string): LambdaFunction {
  return async (event, context) => {
    const result = await fn(event, context);

    return {
      ...result,
      headers: {
        ...result.headers,
        'Access-Control-Allow-Origin': origins,
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET',
      },
    };
  };
}

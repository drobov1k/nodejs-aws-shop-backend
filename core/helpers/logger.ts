import { APIGatewayProxyEvent } from 'aws-lambda';
import { HttpMethod } from '.';

export const logger = {
  info(...args: any[]): void {
    console.info(...args);
  },

  error(...args: any[]): void {
    console.error(...args);
  },

  log(...args: any[]): void {
    console.log(...args);
  },

  warn(...args: any[]): void {
    console.warn(...args);
  },
};

export function logRequest(event: Pick<APIGatewayProxyEvent, 'path' | 'httpMethod' | 'headers' | 'body'>): void {
  let body: string;
  const { path, httpMethod, headers } = event;

  if (httpMethod !== HttpMethod.Get && event.body) {
    // eslint-disable-next-line prefer-destructuring
    body = event.body;
  }

  logger.info({
    path,
    httpMethod,
    headers,
    ...(body && { body }),
  });
}

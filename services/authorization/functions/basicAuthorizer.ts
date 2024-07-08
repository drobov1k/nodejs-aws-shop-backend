import { APIGatewayRequestAuthorizerEvent, Context, Callback } from 'aws-lambda';
import HttpStatus from 'http-status';
import { logger } from '@core/helpers';
import { generatePolicy } from './utils/generatePolicy';
import { tokenAuthorize } from './utils/tokenAuthorize';
import { AuthEventType } from './constants/authEventType';
import { PolicyEffect } from './constants/policyEffect';

export const basicAuthorizer = async (
  event: APIGatewayRequestAuthorizerEvent,
  _ctx: Context,
  cb: Callback,
): Promise<void> => {
  const token = event.headers.Authorization;

  if (event.type !== AuthEventType.Request || !token) {
    logger.error('Unauthorized. Invalid event type or missing token.');
    return cb(HttpStatus['401']);
  }

  try {
    tokenAuthorize(token);
    cb(null, generatePolicy(token, event.methodArn));
  } catch (err) {
    logger.error(`Unauthorized: ${err.message}`);
    cb(null, generatePolicy(token, event.methodArn, PolicyEffect.Deny));
  }
};

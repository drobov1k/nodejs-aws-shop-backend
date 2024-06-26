import HttpStatus from 'http-status';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { errorHandler } from '@core/helpers';
import { s3Client } from '@core/infra/s3';
import Config from '../../../config';

export const importProductsFile = errorHandler(
  async ({ queryStringParameters }: APIGatewayProxyEvent, _ctx?: Context): Promise<APIGatewayProxyResult> => {
    const { name } = queryStringParameters;

    if (!name) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        body: JSON.stringify({
          message: 'Empty file name',
        }),
      };
    }

    const url = await s3Client.createPresignedPost(Config.S3_BUCKET_NAME, `uploaded/${name}`);

    return {
      statusCode: HttpStatus.OK,
      body: JSON.stringify({ url }),
    };
  },
);

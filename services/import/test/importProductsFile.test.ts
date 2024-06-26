import { APIGatewayProxyEvent } from 'aws-lambda';
import HttpStatus from 'http-status';
import { importProductsFile } from '../functions/importProductsFile';

describe('GET /api/import', () => {
  it('should return 400 if file name is not present', async () => {
    const event: APIGatewayProxyEvent = { queryStringParameters: { name: undefined } } as any;
    const response = await importProductsFile(event);

    expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body).toBe(
      JSON.stringify({
        message: 'Empty file name',
      }),
    );
  });

  it('should return a signed url to upload a file', async () => {
    const fileName = `file_${Date.now()}`;
    const event: APIGatewayProxyEvent = { queryStringParameters: { name: fileName } } as any;
    const response = await importProductsFile(event);

    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(JSON.parse(response.body).url).toMatch(
      new RegExp(
        '^https://' +
          process.env.S3_BUCKET_NAME +
          '.s3.' +
          process.env.AWS_REGION +
          '.amazonaws.com/uploaded/' +
          fileName +
          '?',
      ),
    );
  });
});

import { APIGatewayProxyEvent } from 'aws-lambda';
import HttpStatus from 'http-status';
import products from '../mocks/products';
import { getProductsList } from '../functions/getProductsList';

describe('GET /api/products', () => {
  it('should return list of products', async () => {
    const response = await getProductsList(null as APIGatewayProxyEvent);

    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(JSON.parse(response.body)).toEqual(expect.arrayContaining(products));
  });
});

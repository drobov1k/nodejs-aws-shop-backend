import { APIGatewayProxyEvent } from 'aws-lambda';
import HttpStatus from 'http-status';
import { getProductsList } from '../functions/getProductsList';
import { mockProducts } from './mocks';

jest.mock('@core/repositories', () => ({
  productRepository: {
    findAllWithStocks: async () => {
      return Promise.resolve(mockProducts);
    },
  },
}));

describe('GET /api/products', () => {
  it('should return list of products', async () => {
    const response = await getProductsList({} as APIGatewayProxyEvent);

    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(JSON.parse(response.body)).toEqual(expect.arrayContaining(mockProducts));
  });
});

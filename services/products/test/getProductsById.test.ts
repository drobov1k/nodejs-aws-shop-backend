import { APIGatewayProxyEvent } from 'aws-lambda';
import HttpStatus from 'http-status';
import products from '../mocks/products';
import { getProductsById } from '../functions/getProductsById';

describe('GET /api/products/:id', () => {
  it('should return 404 if product not found', async () => {
    const event: APIGatewayProxyEvent = { pathParameters: { id: '123' } } as any;
    const response = await getProductsById(event);

    expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it('should return 200 status and product', async () => {
    const [product] = products;
    const event: APIGatewayProxyEvent = { pathParameters: { id: product.id } } as any;
    const response = await getProductsById(event);

    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(JSON.parse(response.body)).toStrictEqual({
      id: product.id,
      title: product.title,
      description: product.description,
      count: product.count,
      price: product.price,
      imgUrl: product.imgUrl,
    });
  });
});

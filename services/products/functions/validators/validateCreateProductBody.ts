import { CreateProductRequestDto } from '../dto/CreateProductRequestDto';

export function validateCreateProductBody(body?: string): string | undefined {
  let dto: CreateProductRequestDto;

  try {
    dto = JSON.parse(body);

    if (body == null || typeof dto !== 'object') throw new Error();
  } catch (_e) {
    return 'Invalid body';
  }

  const { title, price, count } = dto;

  if (!title) return 'Product title should be present';
  if (price == null || !Number.isInteger(price)) return 'Product price should be integer';
  if (count == null || !Number.isInteger(count)) return 'Product count should be integer';
}

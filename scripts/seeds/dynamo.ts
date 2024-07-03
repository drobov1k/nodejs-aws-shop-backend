import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import Config from '../../config';
import { products } from './data';

const dynamoDbClient = new DynamoDBClient({
  region: Config.AWS_REGION,
});

async function productsSeed(): Promise<string[]> {
  const itemIds = [];

  for (const { title, description, price } of products) {
    const itemId = uuidv4();

    const command = new PutItemCommand({
      TableName: Config.DYNAMODB_PRODUCTS_TABLE,
      Item: {
        id: {
          S: itemId,
        },
        title: {
          S: title,
        },
        description: {
          S: description,
        },
        price: {
          N: price.toString(),
        },
      },
    });

    try {
      await dynamoDbClient.send(command);
    } catch (error) {
      console.error(`Error inserting item with title: ${title}`, error);
    }

    itemIds.push(itemId);
  }

  return itemIds;
}

async function stockSeed(productIds: string[]): Promise<void> {
  for (const productId of productIds) {
    const command = new PutItemCommand({
      TableName: Config.DYNAMODB_STOCKS_TABLE,
      Item: {
        product_id: {
          S: productId,
        },
        count: {
          // random from 1 to 100
          N: (Math.floor(Math.random() * (100 - 1 + 1)) + 1).toString(),
        },
      },
    });

    try {
      await dynamoDbClient.send(command);
    } catch (error) {
      console.error(`Error inserting stock with product id: ${productId}`, error);
    }
  }
}

(async () => {
  try {
    const productIds = await productsSeed();
    await stockSeed(productIds);

    console.log('Seeding completed.');
  } catch (e) {
    console.log('Smth went wrong', e);
  }
})();

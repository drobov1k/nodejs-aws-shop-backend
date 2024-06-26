import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import Config from '../../../config';

export const dynamoDbClientBase = new DynamoDBClient({ region: Config.AWS_REGION });

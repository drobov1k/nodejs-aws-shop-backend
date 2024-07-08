import dotenv from 'dotenv';

dotenv.config();

export default {
  UI_URL: process.env.UI_URL,
  AWS_REGION: process.env.AWS_REGION,
  DYNAMODB_PRODUCTS_TABLE: process.env.DYNAMODB_PRODUCTS_TABLE,
  DYNAMODB_STOCKS_TABLE: process.env.DYNAMODB_STOCKS_TABLE,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  PRODUCT_SQS_QUEUE: process.env.PRODUCT_SQS_QUEUE,
  PRODUCT_SQS_QUEUE_URL: process.env.PRODUCT_SQS_QUEUE_URL,
  PRODUCT_SQS_QUEUE_ARN: process.env.PRODUCT_SQS_QUEUE_ARN,
  PRODUCT_SQS_QUEUE_BATCH_SIZE: +process.env.PRODUCT_SQS_QUEUE_BATCH_SIZE,
  PRODUCT_SNS_TOPIC: process.env.PRODUCT_SNS_TOPIC,
  PRODUCT_SNS_TOPIC_ARN: process.env.PRODUCT_SNS_TOPIC_ARN,
  PRODUCT_SNS_SUBSCRIBER_EMAIL: process.env.PRODUCT_SNS_SUBSCRIBER_EMAIL,
  PRODUCT_SNS_EXPENSIVE_SUBSCRIBER_EMAIL: process.env.PRODUCT_SNS_EXPENSIVE_SUBSCRIBER_EMAIL,
  PRODUCT_SNS_EXPENSIVE_STUFF_MIN_SUM: +process.env.PRODUCT_SNS_EXPENSIVE_STUFF_MIN_SUM,
  AUTH_GITHUB_DEFAULT_USERNAME: process.env.AUTH_GITHUB_DEFAULT_USERNAME,
  AUTH_DEFAULT_PASSWORD: process.env.AUTH_DEFAULT_PASSWORD,
};

export const getEnvValue = (env: string): string => {
  return process.env[env];
};

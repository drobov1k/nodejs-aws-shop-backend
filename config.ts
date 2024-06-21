import dotenv from 'dotenv';

dotenv.config();

export default {
  UI_URL: process.env.UI_URL,
  AWS_REGION: process.env.AWS_REGION,
  DYNAMODB_PRODUCTS_TABLE: process.env.DYNAMODB_PRODUCTS_TABLE,
  DYNAMODB_STOCKS_TABLE: process.env.DYNAMODB_STOCKS_TABLE,
};

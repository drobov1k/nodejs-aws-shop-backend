import dotenv from 'dotenv';

dotenv.config();

export default {
  UI_URL: process.env.UI_URL,
  AWS_REGION: process.env.AWS_REGION,
};

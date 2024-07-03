import Config from '../../../config';
import { SNSClient } from './snsClient';

const snsClient = new SNSClient({
  region: Config.AWS_REGION,
});

export { snsClient };

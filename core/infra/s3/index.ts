import { S3Client } from './s3Client';
import Config from '../../../config';

const s3Client = new S3Client({
  region: Config.AWS_REGION,
});

export { s3Client };

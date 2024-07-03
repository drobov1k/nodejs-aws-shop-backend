import {
  S3Client as AWSS3Client,
  S3ClientConfig,
  PutObjectCommand,
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';

interface MoveObjectArgs {
  sourceBucket: string;
  sourceKey: string;
  destinationKey: string;
  destinationBucket?: string;
}

interface IS3Client {
  createPresignedPost(bucketName: string, key: string): Promise<string>;
  getObject(bucketName: string, key: string): Promise<Readable>;
  moveObject(options: MoveObjectArgs): Promise<void>;
}

export class S3Client extends AWSS3Client implements IS3Client {
  constructor(configuration: S3ClientConfig) {
    super(configuration);
  }

  async createPresignedPost(bucketName: string, key: string): Promise<string> {
    const command = new PutObjectCommand({ Bucket: bucketName, Key: key });
    return getSignedUrl(this, command, { expiresIn: 360 });
  }

  async getObject(bucketName: string, key: string): Promise<Readable> {
    const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
    const result = await this.send(command);

    if (!result) {
      return null;
    }

    return result.Body as Readable;
  }

  async moveObject({
    sourceBucket,
    sourceKey,
    destinationKey,
    destinationBucket = sourceBucket,
  }: MoveObjectArgs): Promise<void> {
    await this.send(
      new CopyObjectCommand({
        Bucket: destinationBucket,
        CopySource: `${sourceBucket}/${sourceKey}`,
        Key: destinationKey,
      }),
    );

    await this.send(
      new DeleteObjectCommand({
        Bucket: sourceBucket,
        Key: sourceKey,
      }),
    );
  }
}
